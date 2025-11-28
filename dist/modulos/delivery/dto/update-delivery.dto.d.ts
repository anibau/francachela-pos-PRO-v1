import { CreateDeliveryDto } from './create-delivery.dto';
import { EstadoDelivery } from '../../../common/enums';
declare const UpdateDeliveryDto_base: import("@nestjs/common").Type<Partial<CreateDeliveryDto>>;
export declare class UpdateDeliveryDto extends UpdateDeliveryDto_base {
    estado?: EstadoDelivery;
    horaSalida?: string;
    horaEntrega?: string;
}
export {};
