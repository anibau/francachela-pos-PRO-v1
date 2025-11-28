import { Repository } from 'typeorm';
import { Delivery } from '../../entities/delivery.entity';
import { Cliente } from '../../entities/cliente.entity';
import { CreateDeliveryDto, EstadoDelivery } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
export declare class DeliveryService {
    private deliveryRepository;
    private clienteRepository;
    constructor(deliveryRepository: Repository<Delivery>, clienteRepository: Repository<Cliente>);
    create(createDeliveryDto: CreateDeliveryDto): Promise<Delivery>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Delivery>>;
    findById(id: number): Promise<Delivery>;
    findByEstado(estado: EstadoDelivery, paginationDto: PaginationDto): Promise<PaginatedResult<Delivery>>;
    findByRepartidor(repartidor: string, paginationDto: PaginationDto): Promise<PaginatedResult<Delivery>>;
    findByDateRange(fechaInicio: Date, fechaFin: Date, paginationDto: PaginationDto): Promise<PaginatedResult<Delivery>>;
    update(id: number, updateDeliveryDto: UpdateDeliveryDto): Promise<Delivery>;
    asignarRepartidor(id: number, repartidor: string): Promise<Delivery>;
    marcarEnCamino(id: number, horaSalida: string): Promise<Delivery>;
    marcarEntregado(id: number, horaEntrega: string): Promise<Delivery>;
    cancelar(id: number): Promise<Delivery>;
    getDeliveriesDelDia(): Promise<{
        deliveries: Delivery[];
        totalDeliveries: number;
        totalFees: number;
    }>;
    getEstadisticasDelivery(fechaInicio: Date, fechaFin: Date): Promise<any>;
    getRepartidores(): Promise<string[]>;
}
