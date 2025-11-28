export declare enum TipoReporte {
    VENTAS = "VENTAS",
    PRODUCTOS = "PRODUCTOS",
    CLIENTES = "CLIENTES",
    INVENTARIO = "INVENTARIO",
    DELIVERY = "DELIVERY"
}
export declare class ExportVentasDto {
    fechaInicio?: string;
    fechaFin?: string;
    tipoReporte?: TipoReporte;
    incluirDetalles?: boolean;
}
