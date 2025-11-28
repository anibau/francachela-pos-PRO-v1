import { TipoMovimiento } from '../../../common/enums';
export declare class ActualizarStockDto {
    cantidad: number;
    tipo: TipoMovimiento;
    observaciones?: string;
    proveedor?: string;
    numeroFactura?: string;
}
