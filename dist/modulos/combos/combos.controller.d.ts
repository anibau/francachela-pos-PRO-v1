import { CombosService } from './combos.service';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class CombosController {
    private readonly combosService;
    constructor(combosService: CombosService);
    create(createComboDto: CreateComboDto): Promise<import("../../entities").Combo>;
    findAll(paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").Combo>>;
    findActivos(paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").Combo>>;
    getCombosPopulares(limit?: number): Promise<any[]>;
    findOne(id: number): Promise<import("../../entities").Combo>;
    verificarDisponibilidad(id: number): Promise<{
        disponible: boolean;
        productosNoDisponibles: string[];
    }>;
    calcularAhorro(id: number): Promise<{
        ahorro: number;
        porcentajeDescuento: number;
    }>;
    update(id: number, updateComboDto: UpdateComboDto): Promise<import("../../entities").Combo>;
    activate(id: number): Promise<import("../../entities").Combo>;
    deactivate(id: number): Promise<import("../../entities").Combo>;
    remove(id: number): Promise<void>;
}
