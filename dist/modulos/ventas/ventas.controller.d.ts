import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { Usuario } from '../../entities/usuario.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class VentasController {
    private readonly ventasService;
    constructor(ventasService: VentasService);
    create(createVentaDto: CreateVentaDto, user: Usuario): Promise<import("../../entities").Venta>;
    findAll(paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").Venta>>;
    getVentasDelDia(): Promise<{
        ventas: import("../../entities").Venta[];
        totalVentas: number;
        totalMonto: number;
    }>;
    getEstadisticas(fechaInicio: string, fechaFin: string): Promise<any>;
    findByDateRange(fechaInicio: string, fechaFin: string, paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").Venta>>;
    findByCliente(clienteId: number, paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").Venta>>;
    findByTicketId(ticketId: string): Promise<import("../../entities").Venta>;
    findOne(id: number): Promise<import("../../entities").Venta>;
    anularVenta(id: number, user: Usuario): Promise<import("../../entities").Venta>;
}
