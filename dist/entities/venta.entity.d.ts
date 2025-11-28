import { Cliente } from './cliente.entity';
export declare enum EstadoVenta {
    COMPLETADO = "COMPLETADO",
    ANULADO = "ANULADO",
    PENDIENTE = "PENDIENTE"
}
export declare enum TipoCompra {
    LOCAL = "LOCAL",
    DELIVERY = "DELIVERY"
}
export declare enum MetodoPago {
    EFECTIVO = "EFECTIVO",
    YAPE = "YAPE",
    PLIN = "PLIN",
    TARJETA = "TARJETA",
    TRANSFERENCIA = "TRANSFERENCIA"
}
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
