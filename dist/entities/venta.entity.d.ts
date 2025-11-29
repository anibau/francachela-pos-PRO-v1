import { Cliente } from './cliente.entity';
import { EstadoVenta, TipoCompra, MetodoPago } from '../common/enums';
export declare class Venta {
    id: number;
    fecha: Date;
    cliente: Cliente;
    clienteId: number;
    listaProductos: any[];
    subTotal: number;
    descuento: number;
    total: number;
    metodoPago: MetodoPago;
    comentario: string;
    cajero: string;
    estado: EstadoVenta;
    puntosOtorgados: number;
    puntosUsados: number;
    ticketId: string;
    tipoCompra: TipoCompra;
    montoRecibido: number;
    vuelto: number;
    fechaCreacion: Date;
    fechaActualizacion: Date;
}
