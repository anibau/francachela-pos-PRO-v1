/**
 * Utilidad para operaciones monetarias con redondeo correcto
 * Resuelve problemas de precisión en aritmética de punto flotante
 * Especialmente importante para sistemas POS
 */
export class MoneyUtil {
  /**
   * Tolerancia para redondeo en comparaciones
   * En un POS se recomienda 0.05 (5 céntimos) para permitir variaciones normales de redondeo
   */
  private static readonly TOLERANCE = 0.05;

  /**
   * Redondea un número a 2 decimales (céntimos)
   * Usa Math.round para evitar errores de punto flotante
   */
  static round(value: number): number {
    return Math.round(value * 100) / 100;
  }

  /**
   * Valida que dos montos sean equivalentes dentro de la tolerancia permitida
   * Útil para comparar pagos totales vs total venta
   */
  static isEqual(amount1: number, amount2: number, tolerance: number = this.TOLERANCE): boolean {
    const rounded1 = this.round(amount1);
    const rounded2 = this.round(amount2);
    const diferencia = Math.abs(rounded1 - rounded2);
    return diferencia <= tolerance;
  }

  /**
   * Obtiene la diferencia entre dos montos, redondeada correctamente
   */
  static getDifference(amount1: number, amount2: number): number {
    return this.round(Math.abs(this.round(amount1) - this.round(amount2)));
  }

  /**
   * Suma un array de montos con redondeo correcto
   * Evita acumulación de errores de punto flotante
   */
  static sum(amounts: number[]): number {
    const total = amounts.reduce((sum, amount) => sum + this.round(amount), 0);
    return this.round(total);
  }

  /**
   * Multiplica cantidad × precio con redondeo correcto
   */
  static multiply(quantity: number, price: number): number {
    return this.round(quantity * this.round(price));
  }

  /**
   * Calcula descuento en monto
   */
  static applyDiscount(amount: number, discountPercent: number): number {
    const discount = this.round((amount * discountPercent) / 100);
    return this.round(amount - discount);
  }

  /**
   * Calcula recargo en monto
   */
  static applyCharge(amount: number, chargePercent: number): number {
    const charge = this.round((amount * chargePercent) / 100);
    return this.round(amount + charge);
  }

  /**
   * Obtiene el vuelto (cambio) redondeado
   * En POS es importante calcular correctamente el cambio
   */
  static getChange(pago: number, total: number): number {
    const change = this.round(pago - total);
    // Evitar cambios negativos debido a redondeo
    return change >= 0 ? change : 0;
  }

  /**
   * Valida que una venta esté pagada completamente dentro de tolerancia
   * @param totalPagado - Suma total de pagos recibidos
   * @param totalVenta - Total de la venta
   * @returns { isValid: boolean, diferencia: number, mensaje: string }
   */
  static validatePayment(totalPagado: number, totalVenta: number): {
    isValid: boolean;
    diferencia: number;
    mensaje: string;
  } {
    const pagado = this.round(totalPagado);
    const venta = this.round(totalVenta);
    const diferencia = this.round(pagado - venta);

    // Permitir un margen pequeño (5 céntimos)
    if (Math.abs(diferencia) <= this.TOLERANCE) {
      if (Math.abs(diferencia) > 0.001) {
        // Hay una pequeña diferencia por redondeo
        return {
          isValid: true,
          diferencia: diferencia,
          mensaje: `Pago aceptado. Diferencia por redondeo: S/ ${Math.abs(diferencia).toFixed(2)}`,
        };
      }
      return {
        isValid: true,
        diferencia: 0,
        mensaje: 'Pago exacto',
      };
    }

    return {
      isValid: false,
      diferencia: diferencia,
      mensaje: `Pago insuficiente o excesivo. Diferencia: S/ ${Math.abs(diferencia).toFixed(2)}`,
    };
  }

  /**
   * Convierte un array de montos a un objeto con montos redondeados
   */
  static normalizeAmounts(amounts: { [key: string]: number }): { [key: string]: number } {
    const normalized: { [key: string]: number } = {};
    for (const key in amounts) {
      if (amounts.hasOwnProperty(key)) {
        normalized[key] = this.round(amounts[key]);
      }
    }
    return normalized;
  }

  /**
   * Formatea un monto para mostrar en la interfaz
   */
  static format(amount: number): string {
    return `S/ ${this.round(amount).toFixed(2)}`;
  }

  /**
   * Obtiene la representación en céntimos (para operaciones sin decimales si es necesario)
   */
  static toCents(amount: number): number {
    return Math.round(amount * 100);
  }

  /**
   * Convierte de céntimos a soles
   */
  static fromCents(cents: number): number {
    return this.round(cents / 100);
  }
}
