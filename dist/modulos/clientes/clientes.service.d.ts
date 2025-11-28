import { Repository } from 'typeorm';
import { Cliente } from '../../entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
export declare class ClientesService {
    private clienteRepository;
    constructor(clienteRepository: Repository<Cliente>);
    create(createClienteDto: CreateClienteDto): Promise<Cliente>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Cliente>>;
    findById(id: number): Promise<Cliente>;
    findByDni(dni: string): Promise<Cliente>;
    findByCodigoCorto(codigoCorto: string): Promise<Cliente>;
    search(query: string, paginationDto: PaginationDto): Promise<PaginatedResult<Cliente>>;
    findCumpleaneros(): Promise<Cliente[]>;
    findTopClientes(limit?: number): Promise<Cliente[]>;
    update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente>;
    acumularPuntos(clienteId: number, puntos: number, ventaId: number, monto: number): Promise<Cliente>;
    canjearPuntos(clienteId: number, puntosUsados: number, ventaId: number, descripcion: string): Promise<Cliente>;
    remove(id: number): Promise<void>;
    activate(id: number): Promise<Cliente>;
    private generateCodigoCorto;
    getEstadisticasCliente(id: number): Promise<any>;
}
