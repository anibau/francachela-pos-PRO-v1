import { Repository } from 'typeorm';
import { Caja } from '../../entities/caja.entity';
import { Venta } from '../../entities/venta.entity';
import { Gasto } from '../../entities/gasto.entity';
import { AbrirCajaDto } from './dto/abrir-caja.dto';
import { CerrarCajaDto } from './dto/cerrar-caja.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
export declare class CajaService {
    private cajaRepository;
    private ventaRepository;
    private gastoRepository;
    constructor(cajaRepository: Repository<Caja>, ventaRepository: Repository<Venta>, gastoRepository: Repository<Gasto>);
    abrirCaja(abrirCajaDto: AbrirCajaDto, cajero: string): Promise<Caja>;
    cerrarCaja(id: number, cerrarCajaDto: CerrarCajaDto): Promise<Caja>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Caja>>;
    findById(id: number): Promise<Caja>;
    getCajaAbierta(cajero?: string): Promise<Caja | null>;
    getCajaActual(cajero: string): Promise<Caja>;
    getResumenCajaActual(cajero: string): Promise<any>;
    private calcularTotalesCaja;
    getCajasPorFecha(fechaInicio: Date, fechaFin: Date): Promise<Caja[]>;
    getEstadisticasCajas(fechaInicio: Date, fechaFin: Date): Promise<any>;
}
