import { CajaService } from './caja.service';
import { AbrirCajaDto } from './dto/abrir-caja.dto';
import { CerrarCajaDto } from './dto/cerrar-caja.dto';
import { Usuario } from '../../entities/usuario.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class CajaController {
    private readonly cajaService;
    constructor(cajaService: CajaService);
    abrirCaja(abrirCajaDto: AbrirCajaDto, user: Usuario): Promise<import("../../entities").Caja>;
    cerrarCaja(id: number, cerrarCajaDto: CerrarCajaDto): Promise<import("../../entities").Caja>;
    findAll(paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").Caja>>;
    getCajaActual(user: Usuario): Promise<import("../../entities").Caja>;
    getResumenCajaActual(user: Usuario): Promise<any>;
    getEstadisticas(fechaInicio: string, fechaFin: string): Promise<any>;
    getCajasPorFecha(fechaInicio: string, fechaFin: string): Promise<import("../../entities").Caja[]>;
    findOne(id: number): Promise<import("../../entities").Caja>;
}
