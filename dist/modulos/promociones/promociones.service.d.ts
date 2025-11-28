import { Repository } from 'typeorm';
import { Promocion } from '../../entities/promocion.entity';
import { TipoPromocion } from '../../common/enums';
import { CreatePromocionDto } from './dto/create-promocion.dto';
import { UpdatePromocionDto } from './dto/update-promocion.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
export declare class PromocionesService {
    private promocionRepository;
    constructor(promocionRepository: Repository<Promocion>);
    create(createPromocionDto: CreatePromocionDto): Promise<Promocion>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Promocion>>;
    findById(id: number): Promise<Promocion>;
    findActivas(): Promise<Promocion[]>;
    findByTipo(tipo: TipoPromocion): Promise<Promocion[]>;
    update(id: number, updatePromocionDto: UpdatePromocionDto): Promise<Promocion>;
    remove(id: number): Promise<void>;
    activate(id: number): Promise<Promocion>;
    aplicarPromocion(promocionId: number, montoCompra: number): Promise<{
        descuento: number;
        aplicable: boolean;
    }>;
    getPromocionesVencidas(): Promise<Promocion[]>;
    desactivarVencidas(): Promise<number>;
}
