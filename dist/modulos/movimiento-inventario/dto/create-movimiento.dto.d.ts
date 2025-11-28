export declare enum TipoMovimiento {
    ENTRADA = "ENTRADA",
    SALIDA = "SALIDA",
    AJUSTE = "AJUSTE"
}
export declare class CreateMovimientoDto {
    codigoBarra: string;
    tipo: TipoMovimiento;
    cantidad: number;
    costo: number;
    precioVenta: number;
    cajero: string;
    proveedor?: string;
}
