import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager, In } from 'typeorm';
import { Cliente } from '../../entities/cliente.entity';
import { ClientePuntosMovimiento, TipoMovimientoPuntos } from '../../entities/cliente-puntos-movimiento.entity';
import { Producto } from '../../entities/producto.entity';
import { MoneyUtil } from '../../common/utils/money.util';
import { PuntosConfigService } from '../config-puntos/puntos-config.service';

/**
 * Servicio dedicado para gestión de puntos de clientes
 * Separado de VentasService para seguir principio de responsabilidad única
 */
@Injectable()
export class PuntosService {
  private readonly DEFAULT_VALOR_PUNTO = 0.1;

  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    @InjectRepository(ClientePuntosMovimiento)
    private movimientosRepository: Repository<ClientePuntosMovimiento>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    private dataSource: DataSource,
    private puntosConfigService: PuntosConfigService,
  ) {}

  /**
   * Calcula el descuento por canje de puntos usando la fórmula correcta
   * @param precio Precio del producto
   * @param puntosUsar Cantidad de puntos a usar
   * @param valorPuntos Valor en soles de cada punto (default: 0.10)
   * @returns Descuento monetario equivalente
   */
  calcularDescuentoPorPuntos(precio: number, puntosUsar: number, valorPuntos: number = this.DEFAULT_VALOR_PUNTO): number {
    if (puntosUsar <= 0) return 0;
    
    // Fórmula oficial: Math.ceil((precio / valorPuntos) * puntosUsar * 100) / 100
    const descuento = Math.ceil((precio / valorPuntos) * puntosUsar * 100) / 100;
    
    // No puede ser mayor al precio del producto
    return Math.min(descuento, precio);
  }

  /**
   * Valida que el cliente tenga suficientes puntos
   * @param clienteId ID del cliente
   * @param puntosRequeridos Puntos que se quieren usar
   * @returns true si tiene suficientes puntos
   */
  async validarPuntosCliente(clienteId: number, puntosRequeridos: number): Promise<boolean> {
    if (puntosRequeridos <= 0) return true;

    const cliente = await this.clienteRepository.findOne({ 
      where: { id: clienteId } 
    });

    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return cliente.puntosAcumulados >= puntosRequeridos;
  }

  /**
   * Registra un movimiento de puntos con transacción segura
   * @param clienteId ID del cliente
   * @param tipo Tipo de movimiento
   * @param puntos Cantidad de puntos (positivo o negativo)
   * @param motivo Descripción del movimiento
   * @param registradoPor Usuario que registra
   * @param ventaId ID de venta relacionada (opcional)
   * @returns Movimiento creado
   */
  async registrarMovimiento(
  manager: EntityManager, // ← SE INYECTA
  clienteId: number,
  tipo: TipoMovimientoPuntos,
  puntos: number,
  motivo: string,
  registradoPor: string,
  ventaId?: number
): Promise<ClientePuntosMovimiento> {
  const cliente = await manager.findOne(Cliente, {
    where: { id: clienteId },
    lock: { mode: 'pessimistic_write' }
  });

  if (!cliente) throw new NotFoundException('Cliente no encontrado');

  const saldoAnterior = cliente.puntosAcumulados;

  if (saldoAnterior + puntos < 0) {
    throw new BadRequestException('Puntos insuficientes');
  }

  const saldoPosterior = saldoAnterior + puntos;

  await manager.update(Cliente, clienteId, { puntosAcumulados: saldoPosterior });

  const movimiento = manager.create(ClientePuntosMovimiento, {
    clienteId,
    tipo,
    puntos,
    valorMonetario: MoneyUtil.round(Math.abs(puntos) * this.DEFAULT_VALOR_PUNTO),
    motivo,
    ventaId,
    registradoPor,
    saldoAnterior,
    saldoPosterior,
  });

  return await manager.save(movimiento);
}


  /**
   * Acumula puntos por una venta
   * @param clienteId ID del cliente
   * @param puntosGanados Puntos ganados
   * @param ventaId ID de la venta
   * @param registradoPor Usuario que registra
   * @returns Movimiento creado
   */
  async acumularPuntosPorVenta(
    manager: EntityManager,
    clienteId: number,
    puntosGanados: number,
    ventaId: number,
    registradoPor: string
  ): Promise<ClientePuntosMovimiento> {
    return await this.registrarMovimiento(
      manager,
      clienteId,
      TipoMovimientoPuntos.ACUMULACION,
      puntosGanados,
      `Puntos ganados por venta #${ventaId}`,
      registradoPor,
      ventaId
    );
  }

  /**
   * Canjea puntos en una venta
   * @param clienteId ID del cliente
   * @param puntosUsados Puntos usados (valor positivo)
   * @param ventaId ID de la venta
   * @param registradoPor Usuario que registra
   * @returns Movimiento creado
   */
  async canjearPuntosEnVenta(
  manager: EntityManager,
  clienteId: number,
  puntosUsados: number,
  ventaId: number,
  registradoPor: string
) {
  return this.registrarMovimiento(
    manager,
    clienteId,
    TipoMovimientoPuntos.CANJE,
    -puntosUsados,
    `Canje de puntos en venta #${ventaId}`,
    registradoPor,
    ventaId
  );
}

  /**
   * Anula movimientos de puntos por anulación de venta
   * @param ventaId ID de la venta anulada
   * @param registradoPor Usuario que anula
   * @returns Movimientos de reverso creados
   */
  async anularMovimientosPorVenta(
  manager: EntityManager,
  ventaId: number,
  registradoPor: string
): Promise<ClientePuntosMovimiento[]> {

  const movimientosOriginales = await manager.find(ClientePuntosMovimiento, {
    where: { ventaId }
  });

  const movimientosReverso: ClientePuntosMovimiento[] = [];

  for (const movimientoOriginal of movimientosOriginales) {
    const movimientoReverso = await this.registrarMovimiento(
      manager,                              // 🔥 ahora es transaccional
      movimientoOriginal.clienteId,
      TipoMovimientoPuntos.REVERSO,
      -movimientoOriginal.puntos,
      `Reverso por anulación de venta #${ventaId} - ${movimientoOriginal.motivo}`,
      registradoPor,
      ventaId
    );

    movimientosReverso.push(movimientoReverso);
  }

  return movimientosReverso;
}


  /**
   * Obtiene el historial de movimientos de un cliente
   * @param clienteId ID del cliente
   * @param limite Número máximo de registros
   * @returns Historial de movimientos
   */
  async obtenerHistorialCliente(clienteId: number, limite: number = 50): Promise<ClientePuntosMovimiento[]> {
    return await this.movimientosRepository.find({
      where: { clienteId },
      order: { fechaMovimiento: 'DESC' },
      take: limite,
      relations: ['venta']
    });
  }

  /**
   * Obtiene estadísticas de puntos por rango de fechas
   * @param fechaInicio Fecha de inicio
   * @param fechaFin Fecha de fin
   * @returns Estadísticas de movimientos
   */
  async obtenerEstadisticasPuntos(fechaInicio: Date, fechaFin: Date) {
    const movimientos = await this.movimientosRepository
      .createQueryBuilder('movimiento')
      .select([
        'movimiento.tipo',
        'SUM(CASE WHEN movimiento.puntos > 0 THEN movimiento.puntos ELSE 0 END) as puntosAcumulados',
        'SUM(CASE WHEN movimiento.puntos < 0 THEN ABS(movimiento.puntos) ELSE 0 END) as puntosCanjeados',
        'COUNT(*) as totalMovimientos'
      ])
      .where('movimiento.fechaMovimiento BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin
      })
      .groupBy('movimiento.tipo')
      .getRawMany();

    return {
      movimientos,
      resumen: {
        totalAcumulados: movimientos
          .filter(m => m.tipo === TipoMovimientoPuntos.ACUMULACION)
          .reduce((sum, m) => sum + parseInt(m.puntosacumulados || '0'), 0),
        totalCanjeados: movimientos
          .filter(m => m.tipo === TipoMovimientoPuntos.CANJE)
          .reduce((sum, m) => sum + parseInt(m.puntoscanjeados || '0'), 0),
        totalReversos: movimientos
          .filter(m => m.tipo === TipoMovimientoPuntos.REVERSO)
          .length
      }
    };
  }

  /**
   * Evalúa puntos disponibles y calcula descuento real sin persistir datos
   * Elimina lógica del frontend y centraliza validaciones
   * @param clienteId ID del cliente
   * @param items Items de la venta para calcular límites
   * @param puntosSolicitados Puntos que quiere usar el cliente
   * @returns Evaluación completa de puntos
   */
  async evaluarPuntos(
    clienteId: number,
    items: Array<{ productoId: number; cantidad: number; precioUnitario?: number }>,
    puntosSolicitados: number
  ): Promise<{
    puntosDisponibles: number;
    puntosAceptados: number;
    descuento: number;
    mensaje: string;
    limitePorProductos: number;
    detalleProductos: Array<{
      productoId: number;
      nombre: string;
      precio: number;
      cantidad: number;
      subtotal: number;
      puntosMaximos: number;
    }>;
  }> {
    // Validar cliente y obtener puntos disponibles
    const cliente = await this.clienteRepository.findOne({ 
      where: { id: clienteId } 
    });

    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    const puntosDisponibles = cliente.puntosAcumulados;
    const config = await this.puntosConfigService.getConfig();
    const valorPunto = config.valorPunto;
    const limitePct = config.limiteCanjePorcentaje;

    // Obtener información de productos
    const productosIds = items.map(item => item.productoId);
    const productos = await this.productoRepository.find({
      where: { id: In(productosIds) },
    });

    if (productos.length !== productosIds.length) {
      throw new BadRequestException('Algunos productos no fueron encontrados');
    }

    // Calcular límites por productos
    let limitePorProductos = 0;
    const detalleProductos: Array<{
      productoId: number;
      nombre: string;
      precio: number;
      cantidad: number;
      subtotal: number;
      puntosMaximos: number;
    }> = [];

    for (const item of items) {
      const producto = productos.find(p => p.id === item.productoId);
      if (!producto) continue;

      const precio = item.precioUnitario ?? producto.precio;
      const subtotal = precio * item.cantidad;

      const puntosMaximosProducto = Math.floor((subtotal * limitePct) / valorPunto);
      limitePorProductos += puntosMaximosProducto;

      detalleProductos.push({
        productoId: producto.id,
        nombre: producto.productoDescripcion,
        precio,
        cantidad: item.cantidad,
        subtotal,
        puntosMaximos: puntosMaximosProducto,
      });
    }

    const limiteFinal = Math.min(
      puntosDisponibles,
      limitePorProductos,
      puntosSolicitados
    );

    const descuento = MoneyUtil.round(limiteFinal * valorPunto);

    // Generar mensaje explicativo
    let mensaje = '';
    if (limiteFinal === puntosSolicitados) {
      mensaje = `Se pueden usar todos los ${puntosSolicitados} puntos solicitados`;
    } else if (limiteFinal === puntosDisponibles) {
      mensaje = `Solo tienes ${puntosDisponibles} puntos disponibles`;
    } else if (limiteFinal === limitePorProductos) {
      mensaje = `Solo se pueden usar ${limitePorProductos} puntos para estos productos (máximo ${Math.round(limitePct * 100)}% del valor)`;
    } else {
      mensaje = `Solo se pueden usar ${limiteFinal} puntos`;
    }

    return {
      puntosDisponibles,
      puntosAceptados: limiteFinal,
      descuento,
      mensaje,
      limitePorProductos,
      detalleProductos,
    };
  }

  /**
   * Ajustar puntos de cliente manualmente (solo administradores)
   * @param clienteId ID del cliente
   * @param puntos Cantidad de puntos a ajustar (positivo/negativo)
   * @param motivo Razón del ajuste
   * @param usuario Usuario que realiza el ajuste
   * @param tipo Tipo de movimiento
   */
  async ajustarPuntos(
    clienteId: number,
    puntos: number,
    motivo: string,
    usuario: string,
    tipo: TipoMovimientoPuntos
  ): Promise<{ mensaje: string; puntosFinales: number }> {
    // Validar cliente
    const cliente = await this.clienteRepository.findOne({
      where: { id: clienteId }
    });

    if (!cliente) {
      throw new BadRequestException(`Cliente con ID ${clienteId} no encontrado`);
    }

    // Validar que no genere saldo negativo
    const puntosFinales = cliente.puntosAcumulados + puntos;
    if (puntosFinales < 0) {
      throw new BadRequestException(
        `El ajuste generaría saldo negativo. Puntos actuales: ${cliente.puntosAcumulados}, Ajuste: ${puntos}`
      );
    }

    // Actualizar puntos del cliente
    cliente.puntosAcumulados = puntosFinales;
    await this.clienteRepository.save(cliente);

    // Registrar movimiento
    const movimiento = this.movimientosRepository.create({
      clienteId: cliente.id,
      puntos: puntos, // Mantener signo original
      tipo,
      motivo: motivo,
      valorMonetario: Math.abs(puntos) * this.DEFAULT_VALOR_PUNTO,
      registradoPor: usuario,
      saldoAnterior: cliente.puntosAcumulados - puntos,
      saldoPosterior: puntosFinales,
    });

    await this.movimientosRepository.save(movimiento);

    return {
      mensaje: `Ajuste realizado exitosamente. ${puntos > 0 ? 'Agregados' : 'Descontados'} ${Math.abs(puntos)} puntos`,
      puntosFinales,
    };
  }


}
