import { GastosService } from './gastos.service';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { Usuario } from '../../entities/usuario.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CategoriaGasto } from '../../common/enums';
export declare class GastosController {
    private readonly gastosService;
    constructor(gastosService: GastosService);
    create(createGastoDto: CreateGastoDto, user: Usuario): Promise<import("../../entities").Gasto>;
    findAll(paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").Gasto>>;
    getGastosDelDia(): Promise<{
        gastos: import("../../entities").Gasto[];
        totalGastos: number;
        totalMonto: number;
    }>;
    getCategorias(): Promise<string[]>;
    getEstadisticas(fechaInicio: string, fechaFin: string): Promise<any>;
    search(query: string, paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").Gasto>>;
    findByDateRange(fechaInicio: string, fechaFin: string, paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").Gasto>>;
    findByCategoria(categoria: CategoriaGasto, paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").Gasto>>;
    findByCajero(cajero: string, paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").Gasto>>;
    findOne(id: number): Promise<import("../../entities").Gasto>;
    update(id: number, updateGastoDto: UpdateGastoDto): Promise<import("../../entities").Gasto>;
    remove(id: number): Promise<void>;
}
