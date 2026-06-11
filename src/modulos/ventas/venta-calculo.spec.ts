import { VentaCalculoService } from './venta-calculo.service';

describe('VentaCalculoService', () => {
  const service = new VentaCalculoService(null as never);
  const defaultConfig = { factorOtorgamiento: 1 };

  describe('calcularSync — caso usuario (102 - 3 - 9.8 + 1 = 90.2)', () => {
    it('calcula total y puntos otorgados correctamente', () => {
      const result = service.calcularSync(
        {
          subtotal: 102,
          descuentoManual: 3,
          descuentoPuntos: 9.8,
          recargoExtra: 1,
          montoPagado: 90.2,
          tieneCliente: true,
        },
        defaultConfig,
      );

      expect(result.total).toBe(90.2);
      expect(result.totalCobrado).toBe(90.2);
      expect(result.descuentoTotal).toBe(12.8);
      expect(result.puntosOtorgados).toBe(90);
    });
  });

  describe('calcularSync — mayoreo (precio ticket distinto al catálogo)', () => {
    it('respeta subtotal con precioUnitario de mayoreo', () => {
      const result = service.calcularSync(
        {
          subtotal: 8.5,
          descuentoManual: 0,
          descuentoPuntos: 0,
          recargoExtra: 0,
          montoPagado: 8.5,
          tieneCliente: true,
        },
        defaultConfig,
      );

      expect(result.total).toBe(8.5);
      expect(result.totalCobrado).toBe(8.5);
      expect(result.puntosOtorgados).toBe(8);
    });
  });

  describe('calcularSync — pago dividido', () => {
    it('acepta suma de pagos igual al total cobrado', () => {
      const result = service.calcularSync(
        {
          subtotal: 102,
          descuentoManual: 3,
          descuentoPuntos: 9.8,
          recargoExtra: 1,
          montoPagado: 90.2,
          tieneCliente: true,
        },
        defaultConfig,
      );

      const pago1 = 50;
      const pago2 = 40.2;
      expect(pago1 + pago2).toBe(result.totalCobrado);
    });
  });

  describe('calcularSync — factor otorgamiento configurable', () => {
    it('aplica factor=2 sobre totalCobrado', () => {
      const result = service.calcularSync(
        {
          subtotal: 102,
          descuentoManual: 3,
          descuentoPuntos: 9.8,
          recargoExtra: 1,
          montoPagado: 90.2,
          tieneCliente: true,
        },
        { factorOtorgamiento: 2 },
      );

      expect(result.puntosOtorgados).toBe(180);
    });
  });

  describe('calcularSync — valorPunto vía descuentoPuntos', () => {
    it('descuento 15 pts × 0.15 = 2.25', () => {
      const result = service.calcularSync(
        {
          subtotal: 50,
          descuentoManual: 0,
          descuentoPuntos: 2.25,
          recargoExtra: 0,
          montoPagado: 47.75,
          tieneCliente: true,
        },
        defaultConfig,
      );

      expect(result.total).toBe(47.75);
      expect(result.descuentoPuntos).toBe(2.25);
    });
  });
});
