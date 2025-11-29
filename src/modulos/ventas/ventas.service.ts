import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Venta } from '../../entities/venta.entity';
import { EstadoVenta } from '../../common/enums';
import { Cliente } from '../../entities/cliente.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { ProductosService } from '../productos/productos.service';
import { ClientesService } from '../clientes/clientes.service';

interface ProductoValidado {
  productoId: number;
  codigoBarra: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  valorPuntos: number;
}

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    private productosService: ProductosService,
    private clientesService: ClientesService,
  ) {}

  async create(createVentaDto: CreateVentaDto, cajero: string): Promise<Venta> {
    const { clienteId, listaProductos, puntosUsados } = createVentaDto;

    // Validar cliente si se proporciona
    let cliente: Cliente | null = null;
    if (clienteId) {
      cliente = await this.clientesService.findById(clienteId);
      
      // Validar puntos si se van a usar
      if (puntosUsados && puntosUsados > 0 && cliente.puntosAcumulados < puntosUsados) {
        throw new BadRequestException('El cliente no tiene suficientes puntos');
      }
    }

    // Validar productos y calcular totales
    let subTotal = 0;
    const productosValidados: ProductoValidado[] = [];

    for (const item of listaProductos) {
      const producto = await this.productosService.findById(item.productoId);
      
      // Verificar stock si el producto usa inventario
      if (producto.usaInventario && producto.cantidadActual < item.cantidad) {
        throw new BadRequestException(`Stock insuficiente para ${producto.productoDescripcion}`);
      }

      const precio = item.precioUnitario || producto.precio;
      const subtotalItem = precio * item.cantidad;
      
      productosValidados.push({
        productoId: producto.id,
        codigoBarra: producto.codigoBarra,
        descripcion: producto.productoDescripcion,
        cantidad: item.cantidad,
        precioUnitario: precio,
        subtotal: subtotalItem,
        valorPuntos: producto.valorPuntos,
      });

      subTotal += subtotalItem;
    }

    // Calcular descuento por puntos usados (1 punto = 0.10 soles)
    const descuentoPorPuntos = (puntosUsados || 0) * 0.10;
    const descuentoTotal = (createVentaDto.descuento || 0) + descuentoPorPuntos;
    const total = subTotal - descuentoTotal;

    if (total < 0) {
      throw new BadRequestException('El total no puede ser negativo');
    }

    // Calcular puntos a otorgar (1 punto por cada sol gastado)
    const puntosOtorgados = clienteId ? Math.floor(total) : 0;

    // Generar ticket ID único
    const ticketId = await this.generateTicketId();

    // Crear la venta
    const venta = this.ventaRepository.create({
      ...createVentaDto,
      cliente: cliente || undefined,
      listaProductos: productosValidados,
      subTotal,
      descuento: descuentoTotal,
      total,
      puntosOtorgados,
      puntosUsados: puntosUsados || 0,
      ticketId,
      cajero,
      estado: EstadoVenta.COMPLETADO,
    });

    const ventaGuardada = await this.ventaRepository.save(venta) as Venta;

    // Descontar stock de productos
    for (const item of productosValidados) {
      await this.productosService.descontarStock(
        item.codigoBarra,
        item.cantidad,
        cajero,
        ventaGuardada.id,
      );
    }

    // Actualizar puntos del cliente
    if (cliente) {
      if (puntosUsados && puntosUsados > 0) {
        await this.clientesService.canjearPuntos(
          cliente.id,
          puntosUsados,
          ventaGuardada.id,
          'Descuento en compra',
        );
      }

      if (puntosOtorgados > 0) {
        await this.clientesService.acumularPuntos(
          cliente.id,
          puntosOtorgados,
          ventaGuardada.id,
          total,
        );
      }
    }

    return this.findById(ventaGuardada.id);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Venta>> {
    const { page, limit, skip } = paginationDto;

    const [data, total] = await this.ventaRepository.findAndCount({
      relations: ['cliente'],
      skip,
      take: limit,
      order: { fecha: 'DESC' },
    });

    const totalPages = Math.ceil(total / (limit || 10));

    return {
      data,
      total,
      page: page || 1,
      limit: limit || 10,
      totalPages,
      hasNextPage: (page || 1) < totalPages,
      hasPrevPage: (page || 1) > 1,
    };
  }

  async findById(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: ['cliente'],
    });
    if (!venta) {
      throw new NotFoundException('Venta no encontrada');
    }
    return venta;
  }

  async findByTicketId(ticketId: string): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({
      where: { ticketId },
      relations: ['cliente'],
    });
    if (!venta) {
      throw new NotFoundException('Venta no encontrada');
    }
    return venta;
  }

  async findByDateRange(fechaInicio: Date, fechaFin: Date, paginationDto: PaginationDto): Promise<PaginatedResult<Venta>> {
    const { page, limit, skip } = paginationDto;

    const [data, total] = await this.ventaRepository.findAndCount({
      where: {
        fecha: Between(fechaInicio, fechaFin),
      },
      relations: ['cliente'],
      skip,
      take: limit,
      order: { fecha: 'DESC' },
    });

    const totalPages = Math.ceil(total / (limit || 10));

    return {
      data,
      total,
      page: page || 1,
      limit: limit || 10,
      totalPages,
      hasNextPage: (page || 1) < totalPages,
      hasPrevPage: (page || 1) > 1,
    };
  }

  async findByCliente(clienteId: number, paginationDto: PaginationDto): Promise<PaginatedResult<Venta>> {
    const { page, limit, skip } = paginationDto;

    const [data, total] = await this.ventaRepository.findAndCount({
      where: { cliente: { id: clienteId } },
      relations: ['cliente'],
      skip,
      take: limit,
      order: { fecha: 'DESC' },
    });

    const totalPages = Math.ceil(total / (limit || 10));

    return {
      data,
      total,
      page: page || 1,
      limit: limit || 10,
      totalPages,
      hasNextPage: (page || 1) < totalPages,
      hasPrevPage: (page || 1) > 1,
    };
  }

  async anularVenta(id: number, cajero: string): Promise<Venta> {
    const venta = await this.findById(id);

    if (venta.estado === EstadoVenta.ANULADO) {
      throw new BadRequestException('La venta ya está anulada');
    }

    // Devolver stock de productos
    for (const item of venta.listaProductos) {
      await this.productosService.devolverStock(
        item.codigoBarra,
        item.cantidad,
        cajero,
        venta.id,
      );
    }

    // Revertir puntos del cliente
    if (venta.cliente) {
      if (venta.puntosOtorgados > 0) {
        await this.clientesService.canjearPuntos(
          venta.cliente.id,
          venta.puntosOtorgados,
          venta.id,
          'Anulación de venta',
        );
      }

      if (venta.puntosUsados > 0) {
        await this.clientesService.acumularPuntos(
          venta.cliente.id,
          venta.puntosUsados,
          venta.id,
          0,
        );
      }
    }

    await this.ventaRepository.update(id, { estado: EstadoVenta.ANULADO });
    return this.findById(id);
  }

  async getVentasDelDia(): Promise<{ ventas: Venta[], totalVentas: number, totalMonto: number }> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const ventas = await this.ventaRepository.find({
      where: {
        fecha: Between(startOfDay, endOfDay),
        estado: EstadoVenta.COMPLETADO,
      },
      relations: ['cliente'],
      order: { fecha: 'DESC' },
    });

    const totalVentas = ventas.length;
    const totalMonto = ventas.reduce((sum, venta) => sum + venta.total, 0);

    return { ventas, totalVentas, totalMonto };
  }

  async getEstadisticasVentas(fechaInicio: Date, fechaFin: Date): Promise<any> {
    const ventas = await this.ventaRepository.find({
      where: {
        fecha: Between(fechaInicio, fechaFin),
        estado: EstadoVenta.COMPLETADO,
      },
      relations: ['cliente'],
    });

    const totalVentas = ventas.length;
    const totalMonto = ventas.reduce((sum, venta) => sum + venta.total, 0);
    const promedioVenta = totalVentas > 0 ? totalMonto / totalVentas : 0;

    // Agrupar por método de pago
    const ventasPorMetodo = ventas.reduce((acc, venta) => {
      acc[venta.metodoPago] = (acc[venta.metodoPago] || 0) + venta.total;
      return acc;
    }, {});

    // Productos más vendidos
    const productosVendidos = {};
    ventas.forEach(venta => {
      venta.listaProductos.forEach(item => {
        if (!productosVendidos[item.codigoBarra]) {
          productosVendidos[item.codigoBarra] = {
            descripcion: item.descripcion,
            cantidad: 0,
            monto: 0,
          };
        }
        productosVendidos[item.codigoBarra].cantidad += item.cantidad;
        productosVendidos[item.codigoBarra].monto += item.subtotal;
      });
    });

    const topProductos = Object.entries(productosVendidos)
      .map(([codigo, data]: [string, any]) => ({ codigoBarra: codigo, ...data }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 10);

    return {
      totalVentas,
      totalMonto,
      promedioVenta,
      ventasPorMetodo,
      topProductos,
    };
  }

  private async generateTicketId(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Contar ventas del día
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    
    const ventasDelDia = await this.ventaRepository.count({
      where: {
        fecha: Between(startOfDay, endOfDay),
      },
    });

    const secuencial = (ventasDelDia + 1).toString().padStart(4, '0');
    return `${dateStr}-${secuencial}`;
  }
}
