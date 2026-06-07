import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Venta } from '../../entities/venta.entity';
import { EstadoVenta } from '../../common/enums';
import { Gasto } from '../../entities/gasto.entity';
import { VentaPago } from '../../entities/venta-pago.entity';
import { EntradasService } from '../entradas/entradas.service';
import { MoneyUtil } from '../../common/utils/money.util';

export interface ResumenCorte {
  periodo: {
    fechaInicio: string;
    fechaFin: string;
  };
  ventas: {
    cantidad: number;
    totalBruto: number;
    totalCobrado: number;
    ajustesRedondeo: number;
    desglosePorMetodo: Record<string, number>;
  };
  entradas: {
    cantidad: number;
    total: number;
    porCategoria: Record<string, number>;
  };
  gastos: {
    cantidad: number;
    total: number;
    porCategoria: Record<string, number>;
  };
  rentabilidad: {
    ingresosTotales: number;
    gastosTotales: number;
    utilidadNeta: number;
    margenUtilidad: number;
  };
}

/**
 * Servicio dedicado para cálculos de corte de caja con contabilidad real
 * Fórmula: rentabilidad = (ventas + entradas) - gastos
 */
@Injectable()
export class CorteService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    @InjectRepository(Gasto)
    private gastoRepository: Repository<Gasto>,
    @InjectRepository(VentaPago)
    private ventaPagoRepository: Repository<VentaPago>,
    private entradasService: EntradasService,
  ) {}

  async calcularCorteCompleto(
    fechaInicio: Date,
    fechaFin: Date,
  ): Promise<ResumenCorte> {
    const [resumenVentas, resumenEntradas, resumenGastos] = await Promise.all([
      this.calcularResumenVentasAgregado(fechaInicio, fechaFin),
      this.entradasService.getResumenAgregado(fechaInicio, fechaFin),
      this.calcularResumenGastosAgregado(fechaInicio, fechaFin),
    ]);

    const ingresosTotales = MoneyUtil.sum([
      resumenVentas.totalCobrado,
      resumenEntradas.total,
    ]);
    const gastosTotales = resumenGastos.total;
    const utilidadNeta = MoneyUtil.round(ingresosTotales - gastosTotales);
    const margenUtilidad =
      ingresosTotales > 0
        ? MoneyUtil.round((utilidadNeta / ingresosTotales) * 100)
        : 0;

    return {
      periodo: {
        fechaInicio: fechaInicio.toISOString().split('T')[0],
        fechaFin: fechaFin.toISOString().split('T')[0],
      },
      ventas: resumenVentas,
      entradas: resumenEntradas,
      gastos: resumenGastos,
      rentabilidad: {
        ingresosTotales,
        gastosTotales,
        utilidadNeta,
        margenUtilidad,
      },
    };
  }

  private async calcularResumenVentasAgregado(fechaInicio: Date, fechaFin: Date) {
    const ventasAgg = await this.ventaRepository
      .createQueryBuilder('venta')
      .select('COUNT(venta.id)', 'cantidad')
      .addSelect('SUM(venta.total)', 'totalBruto')
      .addSelect(
        'SUM(venta.total + COALESCE(venta.ajusteRedondeo, 0))',
        'totalCobrado',
      )
      .addSelect('SUM(COALESCE(venta.ajusteRedondeo, 0))', 'ajustesRedondeo')
      .where('venta.fecha BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin,
      })
      .andWhere('venta.estado = :estado', { estado: EstadoVenta.COMPLETADO })
      .getRawOne();

    const desgloseRows = await this.ventaPagoRepository
      .createQueryBuilder('pago')
      .innerJoin('pago.venta', 'venta')
      .select('pago.metodoPago', 'metodo')
      .addSelect('SUM(pago.monto)', 'total')
      .where('venta.fecha BETWEEN :fechaInicio AND :fechaFin', {
        fechaInicio,
        fechaFin,
      })
      .andWhere('venta.estado = :estado', { estado: EstadoVenta.COMPLETADO })
      .groupBy('pago.metodoPago')
      .getRawMany();

    const desglosePorMetodo: Record<string, number> = {};
    desgloseRows.forEach((row) => {
      desglosePorMetodo[row.metodo] = MoneyUtil.round(parseFloat(row.total) || 0);
    });

    const totalCobrado = MoneyUtil.round(parseFloat(ventasAgg.totalCobrado) || 0);
    const totalPagos = MoneyUtil.sum(Object.values(desglosePorMetodo));

    if (totalPagos === 0 && totalCobrado > 0) {
      desglosePorMetodo.EFECTIVO = totalCobrado;
    }

    return {
      cantidad: parseInt(ventasAgg.cantidad, 10) || 0,
      totalBruto: MoneyUtil.round(parseFloat(ventasAgg.totalBruto) || 0),
      totalCobrado,
      ajustesRedondeo: MoneyUtil.round(parseFloat(ventasAgg.ajustesRedondeo) || 0),
      desglosePorMetodo,
    };
  }

  private async calcularResumenGastosAgregado(fechaInicio: Date, fechaFin: Date) {
    const [cantidad, totalResult, porCategoriaRows] = await Promise.all([
      this.gastoRepository.count({
        where: { fecha: Between(fechaInicio, fechaFin) },
      }),
      this.gastoRepository
        .createQueryBuilder('gasto')
        .select('SUM(gasto.monto)', 'total')
        .where('gasto.fecha BETWEEN :fechaInicio AND :fechaFin', {
          fechaInicio,
          fechaFin,
        })
        .getRawOne(),
      this.gastoRepository
        .createQueryBuilder('gasto')
        .select('COALESCE(gasto.categoria, :sinCategoria)', 'categoria')
        .addSelect('SUM(gasto.monto)', 'total')
        .where('gasto.fecha BETWEEN :fechaInicio AND :fechaFin', {
          fechaInicio,
          fechaFin,
        })
        .groupBy('gasto.categoria')
        .setParameter('sinCategoria', 'SIN_CATEGORIA')
        .getRawMany(),
    ]);

    const porCategoria: Record<string, number> = {};
    porCategoriaRows.forEach((row) => {
      porCategoria[row.categoria || 'SIN_CATEGORIA'] = MoneyUtil.round(
        parseFloat(row.total) || 0,
      );
    });

    return {
      cantidad,
      total: MoneyUtil.round(parseFloat(totalResult.total) || 0),
      porCategoria,
    };
  }

  async obtenerEstadisticasRapidas(fechaInicio: Date, fechaFin: Date) {
    const [totalVentas, totalEntradas, totalGastos, cantidadVentas] =
      await Promise.all([
        this.ventaRepository
          .createQueryBuilder('venta')
          .select('SUM(venta.total + COALESCE(venta.ajusteRedondeo, 0))', 'total')
          .where('venta.fecha BETWEEN :fechaInicio AND :fechaFin', {
            fechaInicio,
            fechaFin,
          })
          .andWhere('venta.estado = :estado', { estado: EstadoVenta.COMPLETADO })
          .getRawOne(),

        this.entradasService.calcularTotalPorRango(fechaInicio, fechaFin),

        this.gastoRepository
          .createQueryBuilder('gasto')
          .select('SUM(gasto.monto)', 'total')
          .where('gasto.fecha BETWEEN :fechaInicio AND :fechaFin', {
            fechaInicio,
            fechaFin,
          })
          .getRawOne(),

        this.ventaRepository.count({
          where: {
            fecha: Between(fechaInicio, fechaFin),
            estado: EstadoVenta.COMPLETADO,
          },
        }),
      ]);

    const ingresosTotales = MoneyUtil.sum([
      parseFloat(totalVentas.total) || 0,
      totalEntradas,
    ]);

    const gastosTotales = parseFloat(totalGastos.total) || 0;
    const utilidadNeta = MoneyUtil.round(ingresosTotales - gastosTotales);

    return {
      ingresosTotales: MoneyUtil.round(ingresosTotales),
      gastosTotales: MoneyUtil.round(gastosTotales),
      utilidadNeta,
      cantidadVentas,
      promedioVenta:
        cantidadVentas > 0
          ? MoneyUtil.round(ingresosTotales / cantidadVentas)
          : 0,
    };
  }
}
