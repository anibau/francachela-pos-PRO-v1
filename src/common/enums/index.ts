// Enums centralizados para todo el proyecto

export enum EstadoDelivery {
  PENDIENTE = 'PENDIENTE',
  ASIGNADO = 'ASIGNADO',
  EN_CAMINO = 'EN_CAMINO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO'
}

export enum TipoPromocion {
  PORCENTAJE = 'PORCENTAJE',
  MONTO = 'MONTO',
  DOS_POR_UNO = '2X1',
  TRES_POR_DOS = '3X2'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  CAJERO = 'CAJERO',
  INVENTARIOS = 'INVENTARIOS'
}

export enum EstadoVenta {
  COMPLETADO = 'COMPLETADO',
  ANULADO = 'ANULADO',
  PENDIENTE = 'PENDIENTE'
}

export enum TipoCompra {
  LOCAL = 'LOCAL',
  DELIVERY = 'DELIVERY'
}

export enum MetodoPago {
  EFECTIVO = 'EFECTIVO',
  YAPE = 'YAPE',
  PLIN = 'PLIN',
  TARJETA = 'TARJETA'
}

export enum EstadoCaja {
  ABIERTA = 'ABIERTA',
  CERRADA = 'CERRADA'
}

export enum CategoriaGasto {
  OPERATIVO = 'OPERATIVO',
  MARKETING = 'MARKETING',
  MANTENIMIENTO = 'MANTENIMIENTO',
  SERVICIOS = 'SERVICIOS',
  OTROS = 'OTROS'
}

export enum TipoMovimiento {
  ENTRADA = 'ENTRADA',
  SALIDA = 'SALIDA',
  AJUSTE = 'AJUSTE',
  VENTA = 'VENTA',
  DEVOLUCION = 'DEVOLUCION'
}
