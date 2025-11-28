import { PromocionesService } from './promociones.service';
import { CreatePromocionDto } from './dto/create-promocion.dto';
import { UpdatePromocionDto } from './dto/update-promocion.dto';
import { TipoPromocion } from '../../common/enums';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class PromocionesController {
    private readonly promocionesService;
    constructor(promocionesService: PromocionesService);
    create(createPromocionDto: CreatePromocionDto): Promise<import("../../entities").Promocion>;
    findAll(paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").Promocion>>;
    findActivas(): Promise<import("../../entities").Promocion[]>;
    getVencidas(): Promise<import("../../entities").Promocion[]>;
    findByTipo(tipo: TipoPromocion): Promise<import("../../entities").Promocion[]>;
    findOne(id: number): Promise<import("../../entities").Promocion>;
    update(id: number, updatePromocionDto: UpdatePromocionDto): Promise<import("../../entities").Promocion>;
    remove(id: number): Promise<void>;
    activate(id: number): Promise<import("../../entities").Promocion>;
    desactivarVencidas(): Promise<number>;
}
