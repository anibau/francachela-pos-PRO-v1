import { CreateDeliveryDto, EstadoDelivery } from './create-delivery.dto';
declare const UpdateDeliveryDto_base: import("@nestjs/common").Type<Partial<CreateDeliveryDto>>;
export declare class UpdateDeliveryDto extends UpdateDeliveryDto_base {
    estado?: EstadoDelivery;
    horaSalida?: string;
    horaEntrega?: string;
}
export {};
