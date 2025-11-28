import { PromocionesService } from './promociones.service';
import { CreatePromocionDto } from './dto/create-promocion.dto';
import { UpdatePromocionDto } from './dto/update-promocion.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { TipoPromocion } from '../../entities/promocion.entity';
export declare class PromocionesController {
    private readonly promocionesService;
    constructor(promocionesService: PromocionesService);
    create(createPromocionDto: CreatePromocionDto): Promise<import("../../entities/promocion.entity").Promocion>;
    findAll(paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities/promocion.entity").Promocion>>;
    findActivas(): Promise<import("../../entities/promocion.entity").Promocion[]>;
    getVencidas(): Promise<import("../../entities/promocion.entity").Promocion[]>;
    findByTipo(tipo: TipoPromocion): Promise<import("../../entities/promocion.entity").Promocion[]>;
    findOne(id: number): Promise<import("../../entities/promocion.entity").Promocion>;
    update(id: number, updatePromocionDto: UpdatePromocionDto): Promise<import("../../entities/promocion.entity").Promocion>;
    remove(id: number): Promise<void>;
    activate(id: number): Promise<import("../../entities/promocion.entity").Promocion>;
    desactivarVencidas(): Promise<number>;
}
