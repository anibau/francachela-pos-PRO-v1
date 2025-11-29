import { MetodoPago, CategoriaGasto } from '../common/enums';
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
