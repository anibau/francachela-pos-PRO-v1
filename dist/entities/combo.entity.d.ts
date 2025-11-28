export declare class Combo {
    id: number;
    nombre: string;
    descripcion: string;
    productos: any[];
    precioOriginal: number;
    precioCombo: number;
    puntosExtra: number;
    activo: boolean;
    imagen: string;
    fechaInicio: Date;
    fechaFin: Date;
    stockDisponible: number;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    get descuentoCombo(): number;
    get porcentajeDescuento(): number;
}
