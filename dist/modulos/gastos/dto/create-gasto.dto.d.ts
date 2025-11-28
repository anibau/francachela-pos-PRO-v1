import { CategoriaGasto } from '../../../entities/gasto.entity';
import { MetodoPago } from '../../../entities/venta.entity';
export declare class CreateGastoDto {
    descripcion: string;
    monto: number;
    categoria: CategoriaGasto;
    metodoPago: MetodoPago;
    proveedor?: string;
    numeroComprobante?: string;
    comprobante?: string;
}
