export declare enum TipoPromocion {
    PORCENTAJE = "PORCENTAJE",
    MONTO = "MONTO",
    DOS_POR_UNO = "2X1",
    TRES_POR_DOS = "3X2"
}
export declare class Promocion {
    id: number;
    nombre: string;
    descripcion: string;
    tipo: TipoPromocion;
    descuento: number;
    fechaInicio: Date;
    fechaFin: Date;
    activo: boolean;
    productosAplicables: number[];
    montoMinimo: number;
    cantidadMaximaUsos: number;
    cantidadUsada: number;
    fechaCreacion: Date;
    fechaActualizacion: Date;
}
