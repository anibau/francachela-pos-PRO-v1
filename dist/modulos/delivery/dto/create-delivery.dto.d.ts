export declare enum EstadoDelivery {
    PENDIENTE = "PENDIENTE",
    ASIGNADO = "ASIGNADO",
    EN_CAMINO = "EN_CAMINO",
    ENTREGADO = "ENTREGADO",
    CANCELADO = "CANCELADO"
}
export declare class CreateDeliveryDto {
    clienteId?: number;
    pedidoId: number;
    direccion: string;
    repartidor: string;
    phone?: string;
    deliveryFee?: number;
    notes?: string;
}
