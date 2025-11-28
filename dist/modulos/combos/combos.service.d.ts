import { Repository } from 'typeorm';
import { Combo } from '../../entities/combo.entity';
import { Producto } from '../../entities/producto.entity';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
export declare class CombosService {
    private comboRepository;
    private productoRepository;
    constructor(comboRepository: Repository<Combo>, productoRepository: Repository<Producto>);
    create(createComboDto: CreateComboDto): Promise<Combo>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Combo>>;
    findById(id: number): Promise<Combo>;
    findActivos(paginationDto: PaginationDto): Promise<PaginatedResult<Combo>>;
    update(id: number, updateComboDto: UpdateComboDto): Promise<Combo>;
    remove(id: number): Promise<void>;
    activate(id: number): Promise<Combo>;
    deactivate(id: number): Promise<Combo>;
    verificarDisponibilidad(comboId: number): Promise<{
        disponible: boolean;
        productosNoDisponibles: string[];
    }>;
    calcularAhorro(comboId: number): Promise<{
        ahorro: number;
        porcentajeDescuento: number;
    }>;
    getCombosPopulares(limit?: number): Promise<any[]>;
}
