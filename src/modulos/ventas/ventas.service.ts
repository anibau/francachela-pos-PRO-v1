import { Injectable, NotFoundException, BadRequestException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, DataSource } from 'typeorm';
import { Venta } from '../../entities/venta.entity';
import { EstadoVenta, MetodoPago, TipoCompra } from '../../common/enums';
import { Cliente } from '../../entities/cliente.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { ProductosService } from '../productos/productos.service';
import { ClientesService } from '../clientes/clientes.service';
import { WhatsappService } from '../whatsapp/whatsapp.service';

/**
 * Interfaz que representa un producto validado y procesado para una venta
 */
interface ProductoValidado {
  productoId: number;
  codigoBarra: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  valorPuntos: number;
}

/**
 * Interfaz para el resumen de cálculos de una venta
 */
interface ResumenVenta {
  subTotal: number;
  descuentoPorPuntos: number;
  descuentoTotal: number;
  total: number;
  puntosOtorgados: number;
  vuelto: number;
}

/**
 * Servicio de Ventas - Maneja la creación, búsqueda y anulación de ventas
 * Incluye integración con inventario, puntos de clientes y notificaciones WhatsApp
 */
@Injectable()
export class VentasService {
  private readonly logger = new Logger(VentasService.name);

  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    private productosService: ProductosService,
    private clientesService: ClientesService,
    private whatsappService: WhatsappService,
    private dataSource: DataSource,
  ) {}

  /**
   * Crear una nueva venta con validaciones completas
   * Valida cliente, productos, stock, puntos y calcula totales
   * Genera transacción para asegurar integridad de datos
   */
  async create(createVentaDto: CreateVentaDto, cajero: string): Promise<Venta> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE'); // Evitar condiciones de carrera

    try {
      this.logger.log(`📝 Iniciando creación de venta por ${cajero}`);

      // ===== 1. VALIDACIÓN DE CLIENTE =====
      let cliente: Cliente | null = null;
      if (createVentaDto.clienteId) {
        cliente = await this.clientesService.findById(createVentaDto.clienteId);
        this.logger.debug(`✓ Cliente validado: ${cliente.nombreCompleto}`);
      }

      // ===== 2. VALIDACIÓN Y PROCESAMIENTO DE PRODUCTOS =====
      const productosValidados = await this._validarYProcesarProductos(
        createVentaDto.listaProductos,
        queryRunner
      );

      // ===== 3. CÁLCULO DE TOTALES =====
      const resumen = this._calcularResumenVenta(
        productosValidados,
        createVentaDto.descuento || 0,
        createVentaDto.puntosUsados || 0,
        cliente
      );

      // ===== 4. VALIDACIÓN DE PUNTOS DEL CLIENTE =====
      if (createVentaDto.puntosUsados && createVentaDto.puntosUsados > 0) {
        if (!cliente) {
          throw new BadRequestException('No se pueden usar puntos sin cliente');
        }
        if (cliente.puntosAcumulados < createVentaDto.puntosUsados) {
          throw new BadRequestException(
            `El cliente solo tiene ${cliente.puntosAcumulados} puntos, no puede usar ${createVentaDto.puntosUsados}`
          );
        }
        this.logger.debug(`✓ Puntos validados: ${cliente.puntosAcumulados} >= ${createVentaDto.puntosUsados}`);
      }

      // ===== 5. GENERAR TICKET ID =====
      const ticketId = await this._generarTicketId(queryRunner);
      this.logger.debug(`✓ Ticket generado: ${ticketId}`);

      // ===== 6. CREAR Y GUARDAR VENTA =====
      const venta = this.ventaRepository.create({
        ...createVentaDto,
        cliente: cliente || undefined,
        listaProductos: productosValidados,
        subTotal: resumen.subTotal,
        descuento: resumen.descuentoTotal,
        total: resumen.total,
        puntosOtorgados: resumen.puntosOtorgados,
        puntosUsados: createVentaDto.puntosUsados || 0,
        montoRecibido: createVentaDto.montoRecibido || resumen.total,
        vuelto: resumen.vuelto,
        ticketId,
        cajero,
        estado: EstadoVenta.COMPLETADO,
      });

      const ventaGuardada = await queryRunner.manager.save(venta);
      this.logger.log(`✓ Venta guardada en BD - ID: ${ventaGuardada.id}, Ticket: ${ticketId}`);

      // ===== 7. DESCONTAR STOCK DE PRODUCTOS =====
      for (const item of productosValidados) {
        try {
          await this.productosService.descontarStock(
            item.codigoBarra,
            item.cantidad,
            cajero,
            ventaGuardada.id,
          );
          this.logger.debug(`✓ Stock descontado: ${item.descripcion} (-${item.cantidad})`);
        } catch (error) {
          throw new InternalServerErrorException(
            `Error descontando stock de ${item.descripcion}: ${error.message}`
          );
        }
      }

      // ===== 8. ACTUALIZAR PUNTOS DEL CLIENTE =====
      if (cliente) {
        // Usar puntos si es necesario
        if (createVentaDto.puntosUsados && createVentaDto.puntosUsados > 0) {
          try {
            await this.clientesService.canjearPuntos(
              cliente.id,
              createVentaDto.puntosUsados,
              ventaGuardada.id,
              'Descuento en compra'
            );
            this.logger.debug(`✓ Puntos canjeados: -${createVentaDto.puntosUsados}`);
          } catch (error) {
            throw new InternalServerErrorException(
              `Error canjeando puntos: ${error.message}`
            );
          }
        }

        // Acumular puntos nuevos
        if (resumen.puntosOtorgados > 0) {
          try {
            await this.clientesService.acumularPuntos(
              cliente.id,
              resumen.puntosOtorgados,
              ventaGuardada.id,
              resumen.total,
            );
            this.logger.debug(`✓ Puntos acumulados: +${resumen.puntosOtorgados}`);
          } catch (error) {
            throw new InternalServerErrorException(
              `Error acumulando puntos: ${error.message}`
            );
          }
        }
      }

      // ===== 9. COMMIT TRANSACCIÓN =====
      await queryRunner.commitTransaction();
      this.logger.log(`✅ Transacción completada - Venta #${ventaGuardada.id} creada exitosamente`);

      // ===== 10. ENVIAR NOTIFICACIÓN WHATSAPP (fuera de transacción) =====
      if (cliente && cliente.telefono) {
        this._enviarNotificacionWhatsApp(cliente, ventaGuardada, resumen).catch(error => {
          this.logger.warn(`⚠️ Error enviando notificación WhatsApp: ${error.message}`);
        });
      }

      // Retornar venta con relaciones cargadas
      return this.findById(ventaGuardada.id);

    } catch (error) {
      // ROLLBACK automático al salir del catch
      await queryRunner.rollbackTransaction();
      
      this.logger.error(`❌ Error creando venta: ${error.message}`);
      
      // Re-lanzar excepciones conocidas
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      
      // Convertir otros errores a formato standar
      throw new InternalServerErrorException(
        `Error creando venta: ${error.message || 'Error desconocido'}`
      );
    } finally {
      await queryRunner.release();
    }
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
    const ventaAnulada = await this.findById(id);

    // Enviar notificación de anulación por WhatsApp si el cliente tiene teléfono
    if (venta.cliente && venta.cliente.telefono) {
      try {
        this.logger.log(`📱 Enviando notificación de anulación WhatsApp a ${venta.cliente.telefono}`);
        
        const mensaje = `⚠️ Tu venta ha sido anulada\n\n` +
          `🎫 Ticket: ${venta.ticketId}\n` +
          `💰 Monto: S/ ${venta.total.toFixed(2)}\n` +
          `⭐ Puntos revertidos: ${venta.puntosOtorgados}\n\n` +
          `Para más información, contacta a Francachela. 📞`;
        
        const resultado = await this.whatsappService.sendMessage({
          phone: venta.cliente.telefono,
          message: mensaje,
          ventaId: id,
        });
        
        if (resultado.success) {
          this.logger.log(`✅ Notificación de anulación enviada a ${venta.cliente.telefono}`);
        } else {
          this.logger.warn(`⚠️ Error al enviar notificación: ${resultado.error}`);
        }
      } catch (error) {
        this.logger.warn(`⚠️ No se pudo enviar notificación de anulación: ${error.message}`);
      }
    }

    return ventaAnulada;
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
    // Asegurar que total sea un número usando parseFloat
    const totalMonto = ventas.reduce((sum, venta) => {
      const ventaTotal = typeof venta.total === 'string' ? parseFloat(venta.total) : venta.total;
      return sum + (isNaN(ventaTotal) ? 0 : ventaTotal);
    }, 0);
    const promedioVenta = totalVentas > 0 ? totalMonto / totalVentas : 0;

    // Agrupar por método de pago - asegurar operaciones numéricas
    const ventasPorMetodo = ventas.reduce((acc, venta) => {
      const ventaTotal = typeof venta.total === 'string' ? parseFloat(venta.total) : venta.total;
      const totalNumerico = isNaN(ventaTotal) ? 0 : ventaTotal;
      acc[venta.metodoPago] = (acc[venta.metodoPago] || 0) + totalNumerico;
      return acc;
    }, {});

    // Productos más vendidos - asegurar operaciones numéricas
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
        
        // Asegurar que cantidad y subtotal sean números
        const cantidad = typeof item.cantidad === 'string' ? parseInt(item.cantidad) : item.cantidad;
        const subtotal = typeof item.subtotal === 'string' ? parseFloat(item.subtotal) : item.subtotal;
        
        productosVendidos[item.codigoBarra].cantidad += isNaN(cantidad) ? 0 : cantidad;
        productosVendidos[item.codigoBarra].monto += isNaN(subtotal) ? 0 : subtotal;
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

  /**
   * Valida y procesa la lista de productos de una venta
   */
  private async _validarYProcesarProductos(
    listaProductos: any[],
    queryRunner: any
  ): Promise<ProductoValidado[]> {
    let subTotal = 0;
    const productosValidados: ProductoValidado[] = [];

    for (const item of listaProductos) {
      const producto = await this.productosService.findById(item.productoId);

      // Validar que el producto exista
      if (!producto) {
        throw new NotFoundException(
          `Producto con ID ${item.productoId} no encontrado`
        );
      }

      // Validar cantidad
      if (item.cantidad <= 0) {
        throw new BadRequestException(
          `Cantidad debe ser mayor a 0 para ${producto.productoDescripcion}`
        );
      }

      // Verificar stock si el producto usa inventario
      if (producto.usaInventario && producto.cantidadActual < item.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para ${producto.productoDescripcion}. ` +
          `Disponible: ${producto.cantidadActual}, solicitado: ${item.cantidad}`
        );
      }

      const precio = item.precioUnitario || producto.precio;

      if (precio <= 0) {
        throw new BadRequestException(
          `Precio inválido para ${producto.productoDescripcion}`
        );
      }

      const subtotalItem = Math.round(precio * item.cantidad * 100) / 100; // Redondear a 2 decimales

      productosValidados.push({
        productoId: producto.id,
        codigoBarra: producto.codigoBarra,
        descripcion: producto.productoDescripcion,
        cantidad: item.cantidad,
        precioUnitario: precio,
        subtotal: subtotalItem,
        valorPuntos: producto.valorPuntos || 0,
      });

      subTotal += subtotalItem;
    }

    if (productosValidados.length === 0) {
      throw new BadRequestException('Debe incluir al menos un producto');
    }

    return productosValidados;
  }

  /**
   * Calcula el resumen completo de la venta (subtotal, descuentos, total, vuelto, puntos)
   */
  private _calcularResumenVenta(
    productosValidados: ProductoValidado[],
    descuentoManual: number = 0,
    puntosUsados: number = 0,
    cliente: Cliente | null
  ): ResumenVenta {
    // Subtotal
    const subTotal = Math.round(
      productosValidados.reduce((sum, p) => sum + p.subtotal, 0) * 100
    ) / 100;

    // Descuento por puntos (1 punto = 0.10 soles)
    const descuentoPorPuntos = Math.round(puntosUsados * 0.10 * 100) / 100;

    // Descuento total
    const descuentoTotal = Math.round((descuentoManual + descuentoPorPuntos) * 100) / 100;

    // Total
    const total = Math.max(0, Math.round((subTotal - descuentoTotal) * 100) / 100);

    // Validar que total no sea negativo
    if (total < 0) {
      throw new BadRequestException(
        `Descuento (S/ ${descuentoTotal.toFixed(2)}) no puede ser mayor al subtotal (S/ ${subTotal.toFixed(2)})`
      );
    }

    // Puntos a otorgar (1 punto por cada sol gastado, solo si hay cliente)
    const puntosOtorgados = cliente ? Math.floor(total) : 0;

    // Vuelto (montoRecibido - total)
    const vuelto = 0; // Se calculará después en el controller si es necesario

    return {
      subTotal,
      descuentoPorPuntos,
      descuentoTotal,
      total,
      puntosOtorgados,
      vuelto,
    };
  }

  /**
   * Genera un ticket ID único con formato YYYYMMDD-XXXX
   */
  private async _generarTicketId(queryRunner: any): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const ventasDelDia = await queryRunner.manager.count(Venta, {
      where: {
        fecha: Between(startOfDay, endOfDay),
      },
    });

    const secuencial = (ventasDelDia + 1).toString().padStart(4, '0');
    return `${dateStr}-${secuencial}`;
  }

  /**
   * Envía notificación de venta por WhatsApp de forma asíncrona
   */
  private async _enviarNotificacionWhatsApp(
    cliente: Cliente,
    venta: Venta,
    resumen: ResumenVenta
  ): Promise<void> {
    try {
      this.logger.log(`📱 Enviando notificación WhatsApp a ${cliente.telefono}`);

      const resultado = await this.whatsappService.sendVentaNotification(
        cliente.telefono,
        venta.total,
        venta.puntosOtorgados,
        venta.ticketId
      );

      if (resultado.success) {
        this.logger.log(
          `✅ Notificación enviada a ${cliente.telefono} - Ticket: ${venta.ticketId}`
        );
      } else {
        this.logger.warn(
          `⚠️ Error enviando WhatsApp: ${resultado.error}`
        );
      }
    } catch (error) {
      this.logger.warn(
        `⚠️ Excepción enviando WhatsApp: ${error.message}`
      );
    }
  }
}
