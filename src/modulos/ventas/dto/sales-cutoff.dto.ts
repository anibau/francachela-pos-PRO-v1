import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO de respuesta para el corte de ventas
 * Contiene métricas financieras agrupadas por período
 */
export class SalesCutoffDto {
  @ApiProperty({ 
    description: 'Fecha de inicio del período', 
    example: '2025-12-01T00:00:00.000Z' 
  })
  fechaInicio: Date;

  @ApiProperty({ 
    description: 'Fecha de fin del período', 
    example: '2025-12-31T23:59:59.999Z' 
  })
  fechaFin: Date;

  @ApiProperty({ 
    description: 'Total de ventas en el período (valor teórico)', 
    example: 15420.50 
  })
  totalVentas: number;

  @ApiProperty({ 
    description: 'Total efectivamente cobrado (incluye ajuste de redondeo)', 
    example: 15425.30 
  })
  totalCobrado: number;

  @ApiProperty({ 
    description: 'Total de ajustes de redondeo aplicados', 
    example: 4.80 
  })
  totalAjusteRedondeo: number;

  @ApiProperty({ 
    description: 'Número de transacciones', 
    example: 127 
  })
  numeroTransacciones: number;

  @ApiProperty({ 
    description: 'Ticket promedio (valor teórico)', 
    example: 121.42 
  })
  ticketPromedio: number;

  @ApiProperty({ 
    description: 'Ticket promedio cobrado (incluye ajuste de redondeo)', 
    example: 121.46 
  })
  ticketPromedioCobrado: number;

  @ApiProperty({ 
    description: 'Total de descuentos aplicados', 
    example: 245.80 
  })
  totalDescuentos: number;

  @ApiProperty({ 
    description: 'Puntos otorgados en el período', 
    example: 15420 
  })
  puntosOtorgados: number;

  @ApiProperty({ 
    description: 'Puntos canjeados en el período', 
    example: 1250 
  })
  puntosCanjeados: number;

  @ApiProperty({ 
    description: 'Desglose por método de pago',
    example: {
      EFECTIVO: { cantidad: 45, monto: 5420.30 },
      YAPE: { cantidad: 38, monto: 4850.20 },
      PLIN: { cantidad: 25, monto: 3200.00 },
      TARJETA: { cantidad: 19, monto: 1950.00 }
    }
  })
  desgloseMetodosPago: {
    [key: string]: {
      cantidad: number;
      monto: number;
    };
  };

  @ApiProperty({ 
    description: 'Desglose por tipo de compra',
    example: {
      LOCAL: { cantidad: 115, monto: 14200.50 },
      DELIVERY: { cantidad: 12, monto: 1220.00 }
    }
  })
  desgloseTipoCompra: {
    [key: string]: {
      cantidad: number;
      monto: number;
    };
  };

  @ApiProperty({ 
    description: 'Top 10 productos más vendidos',
    example: [
      { productoId: 1, descripcion: 'Cerveza Pilsen 650ml', cantidad: 45, monto: 315.00 },
      { productoId: 2, descripcion: 'Inca Kola 500ml', cantidad: 38, monto: 114.00 }
    ]
  })
  topProductos: {
    productoId: number;
    descripcion: string;
    cantidad: number;
    monto: number;
  }[];

  @ApiProperty({ 
    description: 'Ventas por día del período',
    example: [
      { fecha: '2025-12-01', cantidad: 8, monto: 950.50 },
      { fecha: '2025-12-02', cantidad: 12, monto: 1420.30 }
    ]
  })
  ventasPorDia: {
    fecha: string;
    cantidad: number;
    monto: number;
  }[];

  @ApiProperty({ 
    description: 'Ventas anuladas en el período', 
    example: 3 
  })
  ventasAnuladas: number;

  @ApiProperty({ 
    description: 'Monto de ventas anuladas', 
    example: 125.50 
  })
  montoVentasAnuladas: number;
}
