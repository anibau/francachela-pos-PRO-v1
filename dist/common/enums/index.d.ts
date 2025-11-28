export declare enum EstadoDelivery {
    PENDIENTE = "PENDIENTE",
    ASIGNADO = "ASIGNADO",
    EN_CAMINO = "EN_CAMINO",
    ENTREGADO = "ENTREGADO",
    CANCELADO = "CANCELADO"
}
export declare enum TipoPromocion {
    PORCENTAJE = "PORCENTAJE",
    MONTO = "MONTO",
    DOS_POR_UNO = "2X1",
    TRES_POR_DOS = "3X2"
}
export declare enum UserRole {
    ADMIN = "ADMIN",
    CAJERO = "CAJERO",
    INVENTARIOS = "INVENTARIOS"
}
export declare enum EstadoVenta {
    COMPLETADO = "COMPLETADO",
    ANULADO = "ANULADO",
    PENDIENTE = "PENDIENTE"
}
export declare enum TipoCompra {
    LOCAL = "LOCAL",
    DELIVERY = "DELIVERY"
}
export declare enum MetodoPago {
    EFECTIVO = "EFECTIVO",
    YAPE = "YAPE",
    PLIN = "PLIN",
    TARJETA = "TARJETA"
}
export declare enum EstadoCaja {
    ABIERTA = "ABIERTA",
    CERRADA = "CERRADA"
}
export declare enum CategoriaGasto {
    OPERATIVO = "OPERATIVO",
    MARKETING = "MARKETING",
    MANTENIMIENTO = "MANTENIMIENTO",
    SERVICIOS = "SERVICIOS",
    OTROS = "OTROS"
}
export declare enum TipoMovimiento {
    ENTRADA = "ENTRADA",
    SALIDA = "SALIDA",
    AJUSTE = "AJUSTE",
    VENTA = "VENTA",
    DEVOLUCION = "DEVOLUCION"
}
