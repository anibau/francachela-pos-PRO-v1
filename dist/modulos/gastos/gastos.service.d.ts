import { Repository } from 'typeorm';
import { Gasto } from '../../entities/gasto.entity';
import { CategoriaGasto } from '../../common/enums';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
export declare class GastosService {
    private gastoRepository;
    constructor(gastoRepository: Repository<Gasto>);
    create(createGastoDto: CreateGastoDto, cajero: string): Promise<Gasto>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Gasto>>;
    findById(id: number): Promise<Gasto>;
    findByDateRange(fechaInicio: Date, fechaFin: Date, paginationDto: PaginationDto): Promise<PaginatedResult<Gasto>>;
    findByCategoria(categoria: CategoriaGasto, paginationDto: PaginationDto): Promise<PaginatedResult<Gasto>>;
    findByCajero(cajero: string, paginationDto: PaginationDto): Promise<PaginatedResult<Gasto>>;
    search(query: string, paginationDto: PaginationDto): Promise<PaginatedResult<Gasto>>;
    update(id: number, updateGastoDto: UpdateGastoDto): Promise<Gasto>;
    remove(id: number): Promise<void>;
    getGastosDelDia(): Promise<{
        gastos: Gasto[];
        totalGastos: number;
        totalMonto: number;
    }>;
    getEstadisticasGastos(fechaInicio: Date, fechaFin: Date): Promise<any>;
    getCategorias(): Promise<string[]>;
}
