import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cliente } from '../../entities/cliente.entity';
import { ClientePuntosMovimiento, TipoMovimientoPuntos } from '../../entities/cliente-puntos-movimiento.entity';
import { MoneyUtil } from '../../common/utils/money.util';

/**
 * Servicio dedicado para gestión de puntos de clientes
 * Separado de VentasService para seguir principio de responsabilidad única
 */
@Injectable()
export class PuntosService {
  private readonly VALOR_PUNTO = 0.10; // 1 punto = 0.10 soles

  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    @InjectRepository(ClientePuntosMovimiento)
    private movimientosRepository: Repository<ClientePuntosMovimiento>,
    private dataSource: DataSource,
  ) {}

  /**
   * Calcula el descuento por canje de puntos usando la fórmula correcta
   * @param precio Precio del producto
   * @param puntosUsar Cantidad de puntos a usar
   * @param valorPuntos Valor en soles de cada punto (default: 0.10)
   * @returns Descuento monetario equivalente
   */
  calcularDescuentoPorPuntos(precio: number, puntosUsar: number, valorPuntos: number = this.VALOR_PUNTO): number {
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
      throw new BadRequestException('Cliente no encontrado');
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
    clienteId: number,
    tipo: TipoMovimientoPuntos,
    puntos: number,
    motivo: string,
    registradoPor: string,
    ventaId?: number
  ): Promise<ClientePuntosMovimiento> {
    return await this.dataSource.transaction(async manager => {
      // Obtener cliente con lock para evitar condiciones de carrera
      const cliente = await manager.findOne(Cliente, {
        where: { id: clienteId },
        lock: { mode: 'pessimistic_write' }
      });

      if (!cliente) {
        throw new BadRequestException('Cliente no encontrado');
      }

      const saldoAnterior = cliente.puntosAcumulados;

      // Validar que no quede en negativo
      if (saldoAnterior + puntos < 0) {
        throw new BadRequestException(
          `Puntos insuficientes. Disponible: ${saldoAnterior}, Requerido: ${Math.abs(puntos)}`
        );
      }

      // Actualizar saldo del cliente
      const saldoPosterior = saldoAnterior + puntos;
      await manager.update(Cliente, clienteId, { puntosAcumulados: saldoPosterior });

      // Crear registro del movimiento
      const movimiento = manager.create(ClientePuntosMovimiento, {
        clienteId,
        tipo,
        puntos,
        valorMonetario: MoneyUtil.round(Math.abs(puntos) * this.VALOR_PUNTO),
        motivo,
        ventaId,
        registradoPor,
        saldoAnterior,
        saldoPosterior,
      });

      return await manager.save(movimiento);
    });
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
    clienteId: number,
    puntosGanados: number,
    ventaId: number,
    registradoPor: string
  ): Promise<ClientePuntosMovimiento> {
    return await this.registrarMovimiento(
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
    clienteId: number,
    puntosUsados: number,
    ventaId: number,
    registradoPor: string
  ): Promise<ClientePuntosMovimiento> {
    return await this.registrarMovimiento(
      clienteId,
      TipoMovimientoPuntos.CANJE,
      -puntosUsados, // Negativo porque se restan
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
    ventaId: number,
    registradoPor: string
  ): Promise<ClientePuntosMovimiento[]> {
    // Buscar todos los movimientos de esta venta
    const movimientosOriginales = await this.movimientosRepository.find({
      where: { ventaId },
      relations: ['cliente']
    });

    const movimientosReverso: ClientePuntosMovimiento[] = [];

    for (const movimientoOriginal of movimientosOriginales) {
      // Crear movimiento de reverso (signo opuesto)
      const movimientoReverso = await this.registrarMovimiento(
        movimientoOriginal.clienteId,
        TipoMovimientoPuntos.REVERSO,
        -movimientoOriginal.puntos, // Signo opuesto
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
}
