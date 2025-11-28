export declare enum TipoMovimiento {
    ENTRADA = "ENTRADA",
    SALIDA = "SALIDA",
    AJUSTE = "AJUSTE",
    VENTA = "VENTA",
    DEVOLUCION = "DEVOLUCION"
}
export declare class MovimientoInventario {
    id: number;
    hora: Date;
    codigoBarra: string;
    descripcion: string;
    costo: number;
    precioVenta: number;
    existenciaAnterior: number;
    existenciaNueva: number;
    invMinimo: number;
    tipo: TipoMovimiento;
    cantidad: number;
    cajero: string;
    proveedor: string;
    numeroFactura: string;
    observaciones: string;
    ventaId: number;
    fechaCreacion: Date;
    fechaActualizacion: Date;
}
