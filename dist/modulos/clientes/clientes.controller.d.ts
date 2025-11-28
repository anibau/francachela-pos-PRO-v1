import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class ClientesController {
    private readonly clientesService;
    constructor(clientesService: ClientesService);
    create(createClienteDto: CreateClienteDto): Promise<import("../../entities").Cliente>;
    findAll(paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").Cliente>>;
    search(query: string, paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").Cliente>>;
    getCumpleaneros(): Promise<import("../../entities").Cliente[]>;
    getTopClientes(limit?: number): Promise<import("../../entities").Cliente[]>;
    findByDni(dni: string): Promise<import("../../entities").Cliente>;
    findByCodigoCorto(codigoCorto: string): Promise<import("../../entities").Cliente>;
    findOne(id: number): Promise<import("../../entities").Cliente>;
    getEstadisticas(id: number): Promise<any>;
    update(id: number, updateClienteDto: UpdateClienteDto): Promise<import("../../entities").Cliente>;
    remove(id: number): Promise<void>;
    activate(id: number): Promise<import("../../entities").Cliente>;
}
