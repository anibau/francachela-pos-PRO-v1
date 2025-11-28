import { MetodoPago, TipoCompra } from '../../../entities/venta.entity';
export declare class ItemVentaDto {
    productoId: number;
    cantidad: number;
    precioUnitario?: number;
}
export declare class CreateVentaDto {
    clienteId?: number;
    listaProductos: ItemVentaDto[];
    descuento?: number;
    metodoPago: MetodoPago;
    comentario?: string;
    tipoCompra?: TipoCompra;
    montoRecibido?: number;
    puntosUsados?: number;
}
