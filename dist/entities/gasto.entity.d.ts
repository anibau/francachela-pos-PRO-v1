import { MetodoPago } from './venta.entity';
export declare enum CategoriaGasto {
    COMPRAS = "COMPRAS",
    SERVICIOS = "SERVICIOS",
    MANTENIMIENTO = "MANTENIMIENTO",
    PERSONAL = "PERSONAL",
    MARKETING = "MARKETING",
    OTROS = "OTROS"
}
export declare class Gasto {
    id: number;
    fecha: Date;
    descripcion: string;
    monto: number;
    categoria: CategoriaGasto;
    cajero: string;
    comprobante: string;
    metodoPago: MetodoPago;
    proveedor: string;
    numeroComprobante: string;
    fechaCreacion: Date;
    fechaActualizacion: Date;
}
