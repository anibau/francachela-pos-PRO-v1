import { Repository } from 'typeorm';
import { MovimientoInventario } from '../../entities/movimiento-inventario.entity';
import { Producto } from '../../entities/producto.entity';
import { CreateMovimientoDto, TipoMovimiento } from './dto/create-movimiento.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
export declare class MovimientoInventarioService {
    private movimientoRepository;
    private productoRepository;
    constructor(movimientoRepository: Repository<MovimientoInventario>, productoRepository: Repository<Producto>);
    create(createMovimientoDto: CreateMovimientoDto): Promise<MovimientoInventario>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<MovimientoInventario>>;
    findById(id: number): Promise<MovimientoInventario>;
    findByProducto(codigoBarra: string, paginationDto: PaginationDto): Promise<PaginatedResult<MovimientoInventario>>;
    findByTipo(tipo: TipoMovimiento, paginationDto: PaginationDto): Promise<PaginatedResult<MovimientoInventario>>;
    findByDateRange(fechaInicio: Date, fechaFin: Date, paginationDto: PaginationDto): Promise<PaginatedResult<MovimientoInventario>>;
    findByCajero(cajero: string, paginationDto: PaginationDto): Promise<PaginatedResult<MovimientoInventario>>;
    getMovimientosDelDia(): Promise<{
        movimientos: MovimientoInventario[];
        totalMovimientos: number;
    }>;
    getEstadisticasMovimientos(fechaInicio: Date, fechaFin: Date): Promise<any>;
    registrarVenta(codigoBarra: string, cantidad: number, precioVenta: number, cajero: string): Promise<MovimientoInventario>;
    registrarEntrada(codigoBarra: string, cantidad: number, costo: number, precioVenta: number, cajero: string, proveedor?: string): Promise<MovimientoInventario>;
    registrarAjuste(codigoBarra: string, nuevaCantidad: number, costo: number, precioVenta: number, cajero: string): Promise<MovimientoInventario>;
}
