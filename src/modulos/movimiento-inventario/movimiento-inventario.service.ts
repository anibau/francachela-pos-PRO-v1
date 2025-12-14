import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { MovimientoInventario } from '../../entities/movimiento-inventario.entity';
import { Producto } from '../../entities/producto.entity';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { TipoMovimiento } from '../../common/enums';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class MovimientoInventarioService {
  constructor(
    @InjectRepository(MovimientoInventario)
    private movimientoRepository: Repository<MovimientoInventario>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async create(createMovimientoDto: CreateMovimientoDto): Promise<MovimientoInventario> {
    // Buscar el producto por código de barras
    const producto = await this.productoRepository.findOne({
      where: { codigoBarra: createMovimientoDto.codigoBarra }
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Validar cantidad para salidas
    if (createMovimientoDto.tipo === TipoMovimiento.SALIDA) {
      if (producto.usaInventario && producto.cantidadActual < createMovimientoDto.cantidad) {
        throw new BadRequestException('Stock insuficiente para realizar la salida');
      }
    }

    // Calcular nueva cantidad según el tipo de movimiento
    let nuevaCantidad = producto.cantidadActual;
    
    switch (createMovimientoDto.tipo) {
      case TipoMovimiento.ENTRADA:
        nuevaCantidad += createMovimientoDto.cantidad;
        break;
      case TipoMovimiento.SALIDA:
        nuevaCantidad -= createMovimientoDto.cantidad;
        break;
      case TipoMovimiento.AJUSTE:
        nuevaCantidad = createMovimientoDto.cantidad; // Ajuste absoluto
        break;
    }

    // Crear el movimiento
    const movimiento = this.movimientoRepository.create({
      codigoBarra: createMovimientoDto.codigoBarra,
      tipo: createMovimientoDto.tipo,
      cantidad: createMovimientoDto.cantidad,
      costo: createMovimientoDto.costo,
      precioVenta: createMovimientoDto.precioVenta,
      cajero: createMovimientoDto.cajero,
      proveedor: createMovimientoDto.proveedor,
      descripcion: producto.productoDescripcion,
      existenciaAnterior: producto.cantidadActual,
      existenciaNueva: nuevaCantidad,
      existencia: nuevaCantidad,
      invMinimo: producto.cantidadMinima,
    });

    // Actualizar el stock del producto si usa inventario
    if (producto.usaInventario) {
      await this.productoRepository.update(producto.id, {
        cantidadActual: nuevaCantidad,
        costo: createMovimientoDto.costo,
        precio: createMovimientoDto.precioVenta,
      });
    }

    return this.movimientoRepository.save(movimiento);
  }

  async findAll(): Promise<MovimientoInventario[]> {
    return this.movimientoRepository.find({
      order: { hora: 'DESC' },
    });
  }

  async findById(id: number): Promise<MovimientoInventario> {
    const movimiento = await this.movimientoRepository.findOne({ where: { id } });
    if (!movimiento) {
      throw new NotFoundException('Movimiento no encontrado');
    }
    return movimiento;
  }

  async findByProducto(codigoBarra: string, paginationDto: PaginationDto): Promise<PaginatedResult<MovimientoInventario>> {
    const { page, limit, skip } = paginationDto;

    const [data, total] = await this.movimientoRepository.findAndCount({
      where: { codigoBarra },
      skip,
      take: limit,
      order: { hora: 'DESC' },
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

  async findByTipo(tipo: TipoMovimiento, paginationDto: PaginationDto): Promise<PaginatedResult<MovimientoInventario>> {
    const { page, limit, skip } = paginationDto;

    const [data, total] = await this.movimientoRepository.findAndCount({
      where: { tipo },
      skip,
      take: limit,
      order: { hora: 'DESC' },
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

  async findByDateRange(fechaInicio: Date, fechaFin: Date, paginationDto: PaginationDto): Promise<PaginatedResult<MovimientoInventario>> {
    const { page, limit, skip } = paginationDto;

    const [data, total] = await this.movimientoRepository.findAndCount({
      where: {
        hora: Between(fechaInicio, fechaFin),
      },
      skip,
      take: limit,
      order: { hora: 'DESC' },
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

  async findByCajero(cajero: string, paginationDto: PaginationDto): Promise<PaginatedResult<MovimientoInventario>> {
    const { page, limit, skip } = paginationDto;

    const [data, total] = await this.movimientoRepository.findAndCount({
      where: { cajero },
      skip,
      take: limit,
      order: { hora: 'DESC' },
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

  async getMovimientosDelDia(): Promise<{ movimientos: MovimientoInventario[], totalMovimientos: number }> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const movimientos = await this.movimientoRepository.find({
      where: {
        hora: Between(startOfDay, endOfDay),
      },
      order: { hora: 'DESC' },
    });

    return { 
      movimientos, 
      totalMovimientos: movimientos.length 
    };
  }

  async getEstadisticasMovimientos(fechaInicio: Date, fechaFin: Date): Promise<any> {
    const movimientos = await this.movimientoRepository.find({
      where: {
        hora: Between(fechaInicio, fechaFin),
      },
    });

    const totalMovimientos = movimientos.length;

    // Agrupar por tipo
    const movimientosPorTipo = movimientos.reduce((acc, mov) => {
      acc[mov.tipo] = (acc[mov.tipo] || 0) + 1;
      return acc;
    }, {});

    // Agrupar por cajero
    const movimientosPorCajero = movimientos.reduce((acc, mov) => {
      acc[mov.cajero] = (acc[mov.cajero] || 0) + 1;
      return acc;
    }, {});

    // Productos más movidos
    const productosMasMovidos = movimientos.reduce((acc, mov) => {
      const key = `${mov.codigoBarra} - ${mov.descripcion}`;
      acc[key] = (acc[key] || 0) + mov.cantidad;
      return acc;
    }, {});

    // Valor total de movimientos
    const valorTotalEntradas = movimientos
      .filter(m => m.tipo === TipoMovimiento.ENTRADA)
      .reduce((sum, m) => sum + (m.cantidad * m.costo), 0);

    const valorTotalSalidas = movimientos
      .filter(m => m.tipo === TipoMovimiento.SALIDA)
      .reduce((sum, m) => sum + (m.cantidad * m.precioVenta), 0);

    return {
      totalMovimientos,
      movimientosPorTipo,
      movimientosPorCajero,
      productosMasMovidos,
      valorTotalEntradas,
      valorTotalSalidas,
      entradas: movimientos.filter(m => m.tipo === TipoMovimiento.ENTRADA).length,
      salidas: movimientos.filter(m => m.tipo === TipoMovimiento.SALIDA).length,
      ajustes: movimientos.filter(m => m.tipo === TipoMovimiento.AJUSTE).length,
    };
  }

  async registrarVenta(codigoBarra: string, cantidad: number, precioVenta: number, cajero: string): Promise<MovimientoInventario> {
    const createMovimientoDto: CreateMovimientoDto = {
      codigoBarra,
      tipo: TipoMovimiento.SALIDA,
      cantidad,
      costo: 0, // Se obtendrá del producto
      precioVenta,
      cajero,
    };

    // Obtener el costo del producto
    const producto = await this.productoRepository.findOne({
      where: { codigoBarra }
    });

    if (producto) {
      createMovimientoDto.costo = producto.costo;
    }

    return this.create(createMovimientoDto);
  }

  async registrarEntrada(
    codigoBarra: string, 
    cantidad: number, 
    costo: number, 
    precioVenta: number, 
    cajero: string, 
    proveedor?: string
  ): Promise<MovimientoInventario> {
    const createMovimientoDto: CreateMovimientoDto = {
      codigoBarra,
      tipo: TipoMovimiento.ENTRADA,
      cantidad,
      costo,
      precioVenta,
      cajero,
      proveedor,
    };

    return this.create(createMovimientoDto);
  }

  async registrarAjuste(
    codigoBarra: string, 
    nuevaCantidad: number, 
    costo: number, 
    precioVenta: number, 
    cajero: string
  ): Promise<MovimientoInventario> {
    const createMovimientoDto: CreateMovimientoDto = {
      codigoBarra,
      tipo: TipoMovimiento.AJUSTE,
      cantidad: nuevaCantidad,
      costo,
      precioVenta,
      cajero,
    };

    return this.create(createMovimientoDto);
  }
}
