import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto, EstadoDelivery } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class DeliveryController {
    private readonly deliveryService;
    constructor(deliveryService: DeliveryService);
    create(createDeliveryDto: CreateDeliveryDto): Promise<import("../../entities").Delivery>;
    findAll(paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").Delivery>>;
    getDeliveriesDelDia(): Promise<{
        deliveries: import("../../entities").Delivery[];
        totalDeliveries: number;
        totalFees: number;
    }>;
    getRepartidores(): Promise<string[]>;
    getEstadisticas(fechaInicio: string, fechaFin: string): Promise<any>;
    findByEstado(estado: EstadoDelivery, paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").Delivery>>;
    findByRepartidor(repartidor: string, paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").Delivery>>;
    findByDateRange(fechaInicio: string, fechaFin: string, paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").Delivery>>;
    findOne(id: number): Promise<import("../../entities").Delivery>;
    update(id: number, updateDeliveryDto: UpdateDeliveryDto): Promise<import("../../entities").Delivery>;
    asignarRepartidor(id: number, repartidor: string): Promise<import("../../entities").Delivery>;
    marcarEnCamino(id: number, horaSalida: string): Promise<import("../../entities").Delivery>;
    marcarEntregado(id: number, horaEntrega: string): Promise<import("../../entities").Delivery>;
    cancelar(id: number): Promise<import("../../entities").Delivery>;
}
