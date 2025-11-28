import { TipoMovimiento } from '../../../common/enums';
export declare class CreateMovimientoDto {
    codigoBarra: string;
    tipo: TipoMovimiento;
    cantidad: number;
    costo: number;
    precioVenta: number;
    cajero: string;
    proveedor?: string;
}
