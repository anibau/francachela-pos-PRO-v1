import { CategoriaGasto, MetodoPago } from '../../../common/enums';
export declare class CreateGastoDto {
    descripcion: string;
    monto: number;
    categoria: CategoriaGasto;
    metodoPago: MetodoPago;
    proveedor?: string;
    numeroComprobante?: string;
    comprobante?: string;
}
