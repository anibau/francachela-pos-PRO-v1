import { Repository } from 'typeorm';
import { Venta } from '../../entities/venta.entity';
import { Cliente } from '../../entities/cliente.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { ProductosService } from '../productos/productos.service';
import { ClientesService } from '../clientes/clientes.service';
export declare class VentasService {
    private ventaRepository;
    private clienteRepository;
    private productosService;
    private clientesService;
    constructor(ventaRepository: Repository<Venta>, clienteRepository: Repository<Cliente>, productosService: ProductosService, clientesService: ClientesService);
    create(createVentaDto: CreateVentaDto, cajero: string): Promise<Venta>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Venta>>;
    findById(id: number): Promise<Venta>;
    findByTicketId(ticketId: string): Promise<Venta>;
    findByDateRange(fechaInicio: Date, fechaFin: Date, paginationDto: PaginationDto): Promise<PaginatedResult<Venta>>;
    findByCliente(clienteId: number, paginationDto: PaginationDto): Promise<PaginatedResult<Venta>>;
    anularVenta(id: number, cajero: string): Promise<Venta>;
    getVentasDelDia(): Promise<{
        ventas: Venta[];
        totalVentas: number;
        totalMonto: number;
    }>;
    getEstadisticasVentas(fechaInicio: Date, fechaFin: Date): Promise<any>;
    private generateTicketId;
}
