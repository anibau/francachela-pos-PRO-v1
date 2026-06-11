import { BadRequestException, Injectable } from '@nestjs/common';
import { MoneyUtil } from '../../common/utils/money.util';
import { PuntosConfigService } from '../config-puntos/puntos-config.service';

export interface VentaCalculoInput {
  subtotal: number;
  descuentoManual?: number;
  descuentoPromos?: number;
  descuentoPuntos?: number;
  recargoExtra?: number;
  montoPagado?: number;
  efectivoEntregado?: number;
  tieneCliente?: boolean;
}

export interface VentaCalculoResult {
  subtotal: number;
  descuentoPromos: number;
  descuentoPuntos: number;
  descuentoTotal: number;
  recargoExtra: number;
  total: number;
  totalCobrado: number;
  ajusteRedondeo: number;
  vuelto: number;
  puntosOtorgados: number;
}

@Injectable()
export class VentaCalculoService {
  constructor(private readonly puntosConfigService: PuntosConfigService) {}

  async calcular(input: VentaCalculoInput): Promise<VentaCalculoResult> {
    const config = await this.puntosConfigService.getConfig();
    const subtotal = MoneyUtil.round(input.subtotal);
    const descuentoManual = MoneyUtil.round(input.descuentoManual || 0);
    const descuentoPromos = MoneyUtil.round(input.descuentoPromos || 0);
    const descuentoPuntos = MoneyUtil.round(input.descuentoPuntos || 0);
    const recargoExtra = MoneyUtil.round(input.recargoExtra || 0);

    const descuentoTotal = MoneyUtil.round(descuentoManual + descuentoPromos + descuentoPuntos);
    const total = MoneyUtil.round(MoneyUtil.round(subtotal - descuentoTotal) + recargoExtra);

    if (total < 0) {
      throw new BadRequestException(
        `Descuento (S/ ${descuentoTotal.toFixed(2)}) no puede ser mayor al subtotal + recargo`,
      );
    }

    const ajusteRedondeo = MoneyUtil.calculateRoundingAdjustment(total, total);
    const totalCobrado = input.montoPagado != null
      ? MoneyUtil.round(input.montoPagado)
      : MoneyUtil.round(total + ajusteRedondeo);

    if (Math.abs(MoneyUtil.round(totalCobrado - total) - ajusteRedondeo) > 0.01 && input.montoPagado == null) {
      // totalCobrado explícito desde pagos
    }

    const ajusteFinal = MoneyUtil.round(totalCobrado - total);
    if (Math.abs(ajusteFinal) > 0.09) {
      throw new BadRequestException(
        `Ajuste de redondeo excesivo: S/ ${Math.abs(ajusteFinal).toFixed(2)}. Máximo permitido: S/ 0.09`,
      );
    }

    const puntosOtorgados = input.tieneCliente
      ? Math.floor(totalCobrado * config.factorOtorgamiento)
      : 0;

    const vuelto =
      input.efectivoEntregado != null && input.efectivoEntregado > totalCobrado
        ? MoneyUtil.getChange(input.efectivoEntregado, totalCobrado)
        : 0;

    return {
      subtotal,
      descuentoPromos,
      descuentoPuntos,
      descuentoTotal,
      recargoExtra,
      total,
      totalCobrado,
      ajusteRedondeo: ajusteFinal,
      vuelto,
      puntosOtorgados,
    };
  }

  /** Cálculo síncrono con config explícita (tests unitarios) */
  calcularSync(
    input: VentaCalculoInput,
    config: { factorOtorgamiento: number },
  ): VentaCalculoResult {
    const subtotal = MoneyUtil.round(input.subtotal);
    const descuentoManual = MoneyUtil.round(input.descuentoManual || 0);
    const descuentoPromos = MoneyUtil.round(input.descuentoPromos || 0);
    const descuentoPuntos = MoneyUtil.round(input.descuentoPuntos || 0);
    const recargoExtra = MoneyUtil.round(input.recargoExtra || 0);
    const descuentoTotal = MoneyUtil.round(descuentoManual + descuentoPromos + descuentoPuntos);
    const total = MoneyUtil.round(MoneyUtil.round(subtotal - descuentoTotal) + recargoExtra);
    const totalCobrado = input.montoPagado != null ? MoneyUtil.round(input.montoPagado) : total;
    const ajusteRedondeo = MoneyUtil.round(totalCobrado - total);
    const puntosOtorgados = input.tieneCliente
      ? Math.floor(totalCobrado * config.factorOtorgamiento)
      : 0;
    const vuelto =
      input.efectivoEntregado != null && input.efectivoEntregado > totalCobrado
        ? MoneyUtil.getChange(input.efectivoEntregado, totalCobrado)
        : 0;

    return {
      subtotal,
      descuentoPromos,
      descuentoPuntos,
      descuentoTotal,
      recargoExtra,
      total,
      totalCobrado,
      ajusteRedondeo,
      vuelto,
      puntosOtorgados,
    };
  }
}
