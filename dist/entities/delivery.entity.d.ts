import { Cliente } from './cliente.entity';
export declare enum EstadoDelivery {
    PENDIENTE = "PENDIENTE",
    EN_PREPARACION = "EN_PREPARACION",
    EN_CAMINO = "EN_CAMINO",
    ENTREGADO = "ENTREGADO",
    CANCELADO = "CANCELADO"
}
export declare class Delivery {
    id: number;
    fecha: Date;
    cliente: Cliente;
    clienteId: number;
    pedidoId: number;
    direccion: string;
    estado: EstadoDelivery;
    repartidor: string;
    horaSalida: string;
    horaEntrega: string;
    saleId: number;
    phone: string;
    deliveryFee: number;
    notes: string;
    coordenadas: string;
    tiempoEstimado: number;
    fechaCreacion: Date;
    fechaActualizacion: Date;
}
