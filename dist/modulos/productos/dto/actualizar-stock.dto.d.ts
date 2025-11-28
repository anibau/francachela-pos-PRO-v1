import { TipoMovimiento } from '../../../entities/movimiento-inventario.entity';
export declare class ActualizarStockDto {
    cantidad: number;
    tipo: TipoMovimiento;
    observaciones?: string;
    proveedor?: string;
    numeroFactura?: string;
}
