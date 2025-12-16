import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, DataSource } from 'typeorm';
import { Venta } from '../../entities/venta.entity';
import { VentaPago } from '../../entities/venta-pago.entity';
import { EstadoVenta, MetodoPago, TipoCompra } from '../../common/enums';
import { Cliente } from '../../entities/cliente.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { CreateVentaPagoDto } from './dto/venta-pago.dto';
import { SalesCutoffDto } from './dto/sales-cutoff.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { DateRangeDto } from '../../common/dto/date-range.dto';
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
  recargoExtra: number;
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
    @InjectRepository(VentaPago)
    private ventaPagoRepository: Repository<VentaPago>,
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
        queryRunner,
      );

      // ===== 3. CÁLCULO DE TOTALES =====
      const resumen = this._calcularResumenVenta(
        productosValidados,
        createVentaDto.descuento || 0,
        createVentaDto.recargoExtra || 0,
        createVentaDto.puntosUsados || 0,
        cliente,
      );

      // ===== 4. VALIDACIÓN DE PUNTOS DEL CLIENTE =====
      if (createVentaDto.puntosUsados && createVentaDto.puntosUsados > 0) {
        if (!cliente) {
          throw new BadRequestException('No se pueden usar puntos sin cliente');
        }
        if (cliente.puntosAcumulados < createVentaDto.puntosUsados) {
          throw new BadRequestException(
            `El cliente solo tiene ${cliente.puntosAcumulados} puntos, no puede usar ${createVentaDto.puntosUsados}`,
          );
        }
        this.logger.debug(
          `✓ Puntos validados: ${cliente.puntosAcumulados} >= ${createVentaDto.puntosUsados}`,
        );
      }

      // ===== 5. GENERAR TICKET ID =====
      const ticketId = await this._generarTicketId(queryRunner);
      this.logger.debug(`✓ Ticket generado: ${ticketId}`);

      // ===== 6. PROCESAR MÉTODOS DE PAGO NORMALIZADOS =====
      const pagosNormalizados = await this._procesarPagosNormalizados(
        createVentaDto,
        resumen.total,
        cajero,
        queryRunner,
      );
      this.logger.debug(`✓ Pagos normalizados procesados: ${pagosNormalizados.length} métodos`);

      // ===== 7. CREAR Y GUARDAR VENTA =====
      const venta = this.ventaRepository.create({
        ...createVentaDto,
        cliente: cliente || undefined,
        listaProductos: productosValidados,
        subTotal: resumen.subTotal,
        descuento: resumen.descuentoTotal,
        recargoExtra: createVentaDto.recargoExtra || 0,
        total: resumen.total,
        puntosOtorgados: resumen.puntosOtorgados,
        puntosUsados: createVentaDto.puntosUsados || 0,
        montoRecibido: createVentaDto.montoRecibido || resumen.total,
        vuelto: resumen.vuelto,
        ticketId,
        cajero,
        estado: EstadoVenta.COMPLETADO,
        estadoVenta: 'COMPLETADO',
      });

      const ventaGuardada = await queryRunner.manager.save(venta);

      // ===== 8. GUARDAR PAGOS NORMALIZADOS =====
      for (let i = 0; i < pagosNormalizados.length; i++) {
        const pagoData = pagosNormalizados[i];
        const ventaPago = this.ventaPagoRepository.create({
          metodoPago: pagoData.metodoPago,
          monto: pagoData.monto,
          referencia: pagoData.referencia || undefined,
          notas: pagoData.notas || undefined,
          estado: 'COMPLETADO',
          fechaRegistro: new Date(),
          registradoPor: cajero,
          secuencia: i + 1,
          ventaId: ventaGuardada.id,
        });
        await queryRunner.manager.save(ventaPago);
      }

      this.logger.log(
        `✓ Venta y ${pagosNormalizados.length} pagos guardados - ID: ${ventaGuardada.id}, Ticket: ${ticketId}`,
      );

      // ===== 9. DESCONTAR STOCK DE PRODUCTOS =====
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
            `Error descontando stock de ${item.descripcion}: ${error.message}`,
          );
        }
      }

      // ===== 10. ACTUALIZAR PUNTOS DEL CLIENTE =====
      if (cliente) {
        // Usar puntos si es necesario
        if (createVentaDto.puntosUsados && createVentaDto.puntosUsados > 0) {
          try {
            await this.clientesService.canjearPuntos(
              cliente.id,
              createVentaDto.puntosUsados,
              ventaGuardada.id,
              'Descuento en compra',
            );
            this.logger.debug(`✓ Puntos canjeados: -${createVentaDto.puntosUsados}`);
          } catch (error) {
            throw new InternalServerErrorException(`Error canjeando puntos: ${error.message}`);
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
            throw new InternalServerErrorException(`Error acumulando puntos: ${error.message}`);
          }
        }
      }

      // ===== 11. COMMIT TRANSACCIÓN =====
      await queryRunner.commitTransaction();
      this.logger.log(`✅ Transacción completada - Venta #${ventaGuardada.id} creada exitosamente`);

      // ===== 12. ENVIAR NOTIFICACIÓN WHATSAPP (fuera de transacción) =====
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
        `Error creando venta: ${error.message || 'Error desconocido'}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Venta[]> {
    return this.ventaRepository.find({
      relations: ['cliente', 'pagos'],
      order: { fecha: 'DESC' },
    });
  }

  async findById(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: ['cliente', 'pagos'],
    });
    if (!venta) {
      throw new NotFoundException('Venta no encontrada');
    }
    return venta;
  }

  /**
   * Actualiza solo el comentario de una venta existente
   */
  async updateComentario(id: number, comentario: string, usuarioActual: string): Promise<Venta> {
    this.logger.log(`Actualizando comentario de venta ${id} por usuario ${usuarioActual}`);

    // Verificar que la venta existe
    const venta = await this.findById(id);

    // Verificar que la venta no está anulada
    if (venta.estado === EstadoVenta.ANULADO) {
      throw new BadRequestException('No se puede modificar el comentario de una venta anulada');
    }

    // Actualizar solo el comentario
    const comentarioAnterior = venta.comentario;
    venta.comentario = comentario;

    const ventaActualizada = await this.ventaRepository.save(venta);

    // Log para auditoría
    this.logger.log(
      `Comentario actualizado en venta ${id}: "${comentarioAnterior}" → "${comentario}" por ${usuarioActual}`,
    );

    return ventaActualizada;
  }

  async findByTicketId(ticketId: string): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({
      where: { ticketId },
      relations: ['cliente', 'pagos'],
    });
    if (!venta) {
      throw new NotFoundException('Venta no encontrada');
    }
    return venta;
  }

  async findByDateRange(
    fechaInicio: Date,
    fechaFin: Date,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Venta>> {
    const { page, limit, skip } = paginationDto;

    const [data, total] = await this.ventaRepository.findAndCount({
      where: {
        fecha: Between(fechaInicio, fechaFin),
      },
      relations: ['cliente', 'pagos'],
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

  async findByCliente(
    clienteId: number,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Venta>> {
    const { page, limit, skip } = paginationDto;

    const [data, total] = await this.ventaRepository.findAndCount({
      where: { cliente: { id: clienteId } },
      relations: ['cliente', 'pagos'],
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
      await this.productosService.devolverStock(item.codigoBarra, item.cantidad, cajero, venta.id);
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
        this.logger.log(
          `📱 Enviando notificación de anulación WhatsApp a ${venta.cliente.telefono}`,
        );

        const mensaje =
          `⚠️ Tu venta ha sido anulada\n\n` +
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

  async getVentasDelDia(): Promise<{ ventas: Venta[]; totalVentas: number; totalMonto: number }> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const ventas = await this.ventaRepository.find({
      where: {
        fecha: Between(startOfDay, endOfDay),
        estado: EstadoVenta.COMPLETADO,
      },
      relations: ['cliente', 'pagos'],
      order: { fecha: 'DESC' },
    });

    const totalVentas = ventas.length;
    const totalMonto = ventas.reduce((sum, venta) => sum + venta.total, 0);

    return { ventas, totalVentas, totalMonto };
  }

  async getEstadisticasVentas(fechaInicio: Date, fechaFin: Date): Promise<any> {
    // ===== CONSULTA OPTIMIZADA: ESTADÍSTICAS BÁSICAS =====
    const estadisticasBasicas = await this.ventaRepository
      .createQueryBuilder('venta')
      .select([
        'COUNT(venta.id) as totalVentas',
        'COALESCE(SUM(venta.total), 0) as totalMonto',
        'COALESCE(AVG(venta.total), 0) as promedioVenta',
        'COALESCE(SUM(venta.descuento), 0) as totalDescuentos',
        'COALESCE(SUM(venta.recargoExtra), 0) as totalRecargos',
        'COALESCE(SUM(venta.puntosOtorgados), 0) as totalPuntosOtorgados',
        'COALESCE(SUM(venta.puntosUsados), 0) as totalPuntosUsados',
      ])
      .where('venta.fecha BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
      .andWhere('venta.estado = :estado', { estado: EstadoVenta.COMPLETADO })
      .getRawOne();

    // ===== CONSULTA OPTIMIZADA: DESGLOSE POR MÉTODOS DE PAGO =====
    const ventasPorMetodo = await this.ventaPagoRepository
      .createQueryBuilder('pago')
      .innerJoin('pago.venta', 'venta')
      .select([
        'pago.metodoPago as metodoPago',
        'COUNT(DISTINCT venta.id) as cantidadVentas',
        'COALESCE(SUM(pago.monto), 0) as montoTotal',
      ])
      .where('venta.fecha BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
      .andWhere('venta.estado = :estado', { estado: EstadoVenta.COMPLETADO })
      .andWhere('pago.estado = :estadoPago', { estadoPago: 'COMPLETADO' })
      .groupBy('pago.metodoPago')
      .orderBy('montoTotal', 'DESC')
      .getRawMany();

    // ===== CONSULTA OPTIMIZADA: TOP PRODUCTOS VENDIDOS =====
    const topProductos = await this.ventaRepository
      .createQueryBuilder('venta')
      .leftJoin('LATERAL jsonb_array_elements(venta.listaProductos)', 'lp', 'true')
      .select([
        "lp->>'codigoBarra' AS codigoBarra",
        "lp->>'descripcion' AS descripcion",
        "SUM((lp->>'cantidad')::integer) AS cantidad",
        "SUM((lp->>'subtotal')::numeric) AS monto",
      ])
      .where('venta.fecha BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
      .andWhere('venta.estado = :estado', { estado: EstadoVenta.COMPLETADO })
      .groupBy("lp->>'codigoBarra'")
      .addGroupBy("lp->>'descripcion'")
      .orderBy('cantidad', 'DESC')
      .limit(10)
      .getRawMany();

    // ===== CONSULTA OPTIMIZADA: VENTAS POR TIPO DE COMPRA =====
    const ventasPorTipo = await this.ventaRepository
      .createQueryBuilder('venta')
      .select([
        "COALESCE(venta.tipoCompra, 'LOCAL') as tipoCompra",
        'COUNT(venta.id) as cantidadVentas',
        'COALESCE(SUM(venta.total), 0) as montoTotal',
      ])
      .where('venta.fecha BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
      .andWhere('venta.estado = :estado', { estado: EstadoVenta.COMPLETADO })
      .groupBy('venta.tipoCompra')
      .orderBy('montoTotal', 'DESC')
      .getRawMany();

    // ===== FORMATEAR RESULTADOS =====
    const ventasPorMetodoFormateado = ventasPorMetodo.reduce((acc, item) => {
      acc[item.metodoPago] = {
        cantidadVentas: parseInt(item.cantidadVentas),
        montoTotal: parseFloat(item.montoTotal),
      };
      return acc;
    }, {});

    const ventasPorTipoFormateado = ventasPorTipo.reduce((acc, item) => {
      acc[item.tipoCompra] = {
        cantidadVentas: parseInt(item.cantidadVentas),
        montoTotal: parseFloat(item.montoTotal),
      };
      return acc;
    }, {});

    const topProductosFormateado = topProductos.map(item => ({
      codigoBarra: item.codigoBarra,
      descripcion: item.descripcion,
      cantidad: parseInt(item.cantidad),
      monto: parseFloat(item.monto),
    }));

    this.logger.debug(
      `✓ Estadísticas calculadas: ${estadisticasBasicas.totalVentas} ventas, ${ventasPorMetodo.length} métodos de pago`,
    );

    return {
      // Estadísticas básicas
      totalVentas: parseInt(estadisticasBasicas.totalVentas),
      totalMonto: parseFloat(estadisticasBasicas.totalMonto),
      promedioVenta: parseFloat(estadisticasBasicas.promedioVenta),
      totalDescuentos: parseFloat(estadisticasBasicas.totalDescuentos),
      totalRecargos: parseFloat(estadisticasBasicas.totalRecargos),
      totalPuntosOtorgados: parseInt(estadisticasBasicas.totalPuntosOtorgados),
      totalPuntosUsados: parseInt(estadisticasBasicas.totalPuntosUsados),

      // Desgloses
      ventasPorMetodo: ventasPorMetodoFormateado,
      ventasPorTipo: ventasPorTipoFormateado,
      topProductos: topProductosFormateado,

      // Metadatos
      fechaInicio,
      fechaFin,
      fechaGeneracion: new Date(),
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
    queryRunner: any,
  ): Promise<ProductoValidado[]> {
    let subTotal = 0;
    const productosValidados: ProductoValidado[] = [];

    for (const item of listaProductos) {
      const producto = await this.productosService.findById(item.productoId);

      // Validar que el producto exista
      if (!producto) {
        throw new NotFoundException(`Producto con ID ${item.productoId} no encontrado`);
      }

      // Validar cantidad
      if (item.cantidad <= 0) {
        throw new BadRequestException(
          `Cantidad debe ser mayor a 0 para ${producto.productoDescripcion}`,
        );
      }

      // Verificar stock si el producto usa inventario
      if (producto.usaInventario && producto.cantidadActual < item.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para ${producto.productoDescripcion}. ` +
            `Disponible: ${producto.cantidadActual}, solicitado: ${item.cantidad}`,
        );
      }

      const precio = item.precioUnitario || producto.precio;

      if (precio <= 0) {
        throw new BadRequestException(`Precio inválido para ${producto.productoDescripcion}`);
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
    recargoExtra: number = 0,
    puntosUsados: number = 0,
    cliente: Cliente | null,
  ): ResumenVenta {
    // Subtotal
    const subTotal =
      Math.round(productosValidados.reduce((sum, p) => sum + p.subtotal, 0) * 100) / 100;

    // Descuento por puntos (1 punto = 0.10 soles)
    const descuentoPorPuntos = Math.round(puntosUsados * 0.1 * 100) / 100;

    // Descuento total
    const descuentoTotal = Math.round((descuentoManual + descuentoPorPuntos) * 100) / 100;

    // Total con recargo extra
    const total = Math.max(0, Math.round((subTotal - descuentoTotal + recargoExtra) * 100) / 100);

    // Validar que total no sea negativo
    if (total < 0) {
      throw new BadRequestException(
        `Descuento (S/ ${descuentoTotal.toFixed(2)}) no puede ser mayor al subtotal + recargo (S/ ${(subTotal + recargoExtra).toFixed(2)})`,
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
      recargoExtra,
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
   * Genera reporte de corte de ventas por rango de fechas
   * Incluye métricas financieras, desglose por métodos de pago y productos más vendidos
   */
  async getSalesCutoffReport(dateRangeDto: DateRangeDto): Promise<SalesCutoffDto> {
    // Convertir fechas string a Date
    const fechaInicio = dateRangeDto.fechaInicio
      ? new Date(dateRangeDto.fechaInicio)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const fechaFin = dateRangeDto.fechaFin
      ? new Date(dateRangeDto.fechaFin)
      : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999);

    this.logger.log(
      `📊 Generando corte de ventas desde ${fechaInicio.toISOString()} hasta ${fechaFin.toISOString()}`,
    );

    try {
      // Obtener todas las ventas del período (incluyendo anuladas para estadísticas)
      const ventas = await this.ventaRepository.find({
        where: {
          fecha: Between(fechaInicio, fechaFin),
        },
        relations: ['cliente', 'pagos'],
        order: { fecha: 'ASC' },
      });

      // Filtrar ventas completadas para cálculos principales
      const ventasCompletadas = ventas.filter(v => v.estado === EstadoVenta.COMPLETADO);
      const ventasAnuladas = ventas.filter(v => v.estado === EstadoVenta.ANULADO);

      // Métricas básicas
      const totalVentas = ventasCompletadas.reduce((sum, v) => sum + v.total, 0);
      const numeroTransacciones = ventasCompletadas.length;
      const ticketPromedio = numeroTransacciones > 0 ? totalVentas / numeroTransacciones : 0;
      const totalDescuentos = ventasCompletadas.reduce((sum, v) => sum + v.descuento, 0);
      const puntosOtorgados = ventasCompletadas.reduce((sum, v) => sum + v.puntosOtorgados, 0);
      const puntosCanjeados = ventasCompletadas.reduce((sum, v) => sum + v.puntosUsados, 0);

      // ===== CONSULTA OPTIMIZADA: DESGLOSE POR MÉTODOS DE PAGO =====
      const desgloseMetodosPagoRaw = await this.ventaPagoRepository
        .createQueryBuilder('pago')
        .innerJoin('pago.venta', 'venta')
        .select([
          'pago.metodoPago as metodoPago',
          'COUNT(DISTINCT venta.id) as cantidad',
          'COALESCE(SUM(pago.monto), 0) as monto',
        ])
        .where('venta.fecha BETWEEN :fechaInicio AND :fechaFin', { fechaInicio, fechaFin })
        .andWhere('venta.estado = :estado', { estado: EstadoVenta.COMPLETADO })
        .andWhere('pago.estado = :estadoPago', { estadoPago: 'COMPLETADO' })
        .groupBy('pago.metodoPago')
        .orderBy('monto', 'DESC')
        .getRawMany();

      // Formatear desglose de métodos de pago
      const desgloseMetodosPago: { [key: string]: { cantidad: number; monto: number } } = {};
      desgloseMetodosPagoRaw.forEach(item => {
        desgloseMetodosPago[item.metodoPago] = {
          cantidad: parseInt(item.cantidad),
          monto: parseFloat(item.monto),
        };
      });

      // Nota: Código de compatibilidad temporal eliminado - ahora solo usa venta_pagos

      // Desglose por tipo de compra
      const desgloseTipoCompra: { [key: string]: { cantidad: number; monto: number } } = {};
      ventasCompletadas.forEach(venta => {
        const tipo = venta.tipoCompra || TipoCompra.LOCAL;
        if (!desgloseTipoCompra[tipo]) {
          desgloseTipoCompra[tipo] = { cantidad: 0, monto: 0 };
        }
        desgloseTipoCompra[tipo].cantidad += 1;
        desgloseTipoCompra[tipo].monto += venta.total;
      });

      // Top productos más vendidos
      const productosVendidos: {
        [key: number]: { descripcion: string; cantidad: number; monto: number };
      } = {};

      ventasCompletadas.forEach(venta => {
        venta.listaProductos.forEach((item: any) => {
          const productoId = item.productoId || item.id;
          if (!productosVendidos[productoId]) {
            productosVendidos[productoId] = {
              descripcion:
                item.descripcion || item.productoDescripcion || 'Producto sin descripción',
              cantidad: 0,
              monto: 0,
            };
          }
          productosVendidos[productoId].cantidad += item.cantidad;
          productosVendidos[productoId].monto +=
            item.subtotal || item.cantidad * item.precioUnitario;
        });
      });

      const topProductos = Object.entries(productosVendidos)
        .map(([productoId, data]) => ({
          productoId: parseInt(productoId),
          descripcion: data.descripcion,
          cantidad: data.cantidad,
          monto: data.monto,
        }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 10);

      // Ventas por día
      const ventasPorDia: { [key: string]: { cantidad: number; monto: number } } = {};

      ventasCompletadas.forEach(venta => {
        const fecha = venta.fecha.toISOString().split('T')[0]; // YYYY-MM-DD
        if (!ventasPorDia[fecha]) {
          ventasPorDia[fecha] = { cantidad: 0, monto: 0 };
        }
        ventasPorDia[fecha].cantidad += 1;
        ventasPorDia[fecha].monto += venta.total;
      });

      const ventasPorDiaArray = Object.entries(ventasPorDia)
        .map(([fecha, data]) => ({
          fecha,
          cantidad: data.cantidad,
          monto: data.monto,
        }))
        .sort((a, b) => a.fecha.localeCompare(b.fecha));

      // Métricas de ventas anuladas
      const ventasAnuladasCount = ventasAnuladas.length;
      const montoVentasAnuladas = ventasAnuladas.reduce((sum, v) => sum + v.total, 0);

      const resultado: SalesCutoffDto = {
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        totalVentas: Math.round(totalVentas * 100) / 100,
        numeroTransacciones,
        ticketPromedio: Math.round(ticketPromedio * 100) / 100,
        totalDescuentos: Math.round(totalDescuentos * 100) / 100,
        puntosOtorgados,
        puntosCanjeados,
        desgloseMetodosPago,
        desgloseTipoCompra,
        topProductos,
        ventasPorDia: ventasPorDiaArray,
        ventasAnuladas: ventasAnuladasCount,
        montoVentasAnuladas: Math.round(montoVentasAnuladas * 100) / 100,
      };

      this.logger.log(
        `✅ Corte generado: ${numeroTransacciones} ventas, S/ ${totalVentas.toFixed(2)} total`,
      );
      return resultado;
    } catch (error) {
      this.logger.error(`❌ Error generando corte de ventas: ${error.message}`);
      throw new InternalServerErrorException(`Error generando reporte: ${error.message}`);
    }
  }

  /**
   * Procesa los métodos de pago para una venta
   * Usa únicamente el formato normalizado metodosPageo
   */
  private _procesarMetodosPago(
    createVentaDto: CreateVentaDto,
    totalVenta: number,
  ): { metodoPago: MetodoPago; monto: number; referencia?: string; timestamp: Date }[] {
    const now = new Date();

    // Validar que metodosPageo esté presente
    if (!createVentaDto.metodosPageo || createVentaDto.metodosPageo.length === 0) {
      throw new BadRequestException('Debe especificar al menos un método de pago');
    }

    // Validar que la suma de montos sea igual al total
    const sumaMontos = createVentaDto.metodosPageo.reduce((sum, metodo) => sum + metodo.monto, 0);
    const diferencia = Math.abs(sumaMontos - totalVenta);

    if (diferencia > 0.01) {
      // Tolerancia de 1 centavo para errores de redondeo
      throw new BadRequestException(
        `La suma de métodos de pago (S/ ${sumaMontos.toFixed(2)}) debe ser igual al total (S/ ${totalVenta.toFixed(2)})`,
      );
    }

    return createVentaDto.metodosPageo.map(metodo => ({
      metodoPago: metodo.metodoPago,
      monto: metodo.monto,
      referencia: metodo.referencia,
      timestamp: now,
    }));
  }

  /**
   * Procesa métodos de pago normalizados para la nueva arquitectura
   * Convierte los datos del DTO en registros para la tabla venta_pagos
   */
  private async _procesarPagosNormalizados(
    createVentaDto: CreateVentaDto,
    totalVenta: number,
    cajero: string,
    queryRunner: any,
  ): Promise<CreateVentaPagoDto[]> {
    const pagosNormalizados: CreateVentaPagoDto[] = [];
    let secuencia = 1;

    // Validar que metodosPageo esté presente
    if (!createVentaDto.metodosPageo || createVentaDto.metodosPageo.length === 0) {
      throw new BadRequestException('Debe especificar al menos un método de pago');
    }

    // Procesar métodos de pago
    for (const metodo of createVentaDto.metodosPageo) {
      pagosNormalizados.push({
        metodoPago: metodo.metodoPago,
        monto: metodo.monto,
        referencia: metodo.referencia || undefined,
      });
    }

    // Validar que la suma de pagos coincida con el total
    const sumaPagos = pagosNormalizados.reduce((sum, pago) => sum + pago.monto, 0);
    const diferencia = Math.abs(sumaPagos - totalVenta);

    if (diferencia > 0.01) {
      // Tolerancia de 1 centavo para redondeo
      throw new BadRequestException(
        `La suma de pagos (S/ ${sumaPagos.toFixed(2)}) no coincide con el total de la venta (S/ ${totalVenta.toFixed(2)})`,
      );
    }

    this.logger.debug(
      `✓ Pagos validados: ${pagosNormalizados.length} métodos, suma: S/ ${sumaPagos.toFixed(2)}`,
    );
    return pagosNormalizados;
  }

  /**
   * Envía notificación de venta por WhatsApp de forma asíncrona
   */
  private async _enviarNotificacionWhatsApp(
    cliente: Cliente,
    venta: Venta,
    resumen: ResumenVenta,
  ): Promise<void> {
    try {
      this.logger.log(`📱 Enviando notificación WhatsApp a ${cliente.telefono}`);

      const resultado = await this.whatsappService.sendVentaNotification(
        cliente.telefono,
        venta.total,
        venta.puntosOtorgados,
        venta.ticketId,
      );

      if (resultado.success) {
        this.logger.log(
          `✅ Notificación enviada a ${cliente.telefono} - Ticket: ${venta.ticketId}`,
        );
      } else {
        this.logger.warn(`⚠️ Error enviando WhatsApp: ${resultado.error}`);
      }
    } catch (error) {
      this.logger.warn(`⚠️ Excepción enviando WhatsApp: ${error.message}`);
    }
  }
}
