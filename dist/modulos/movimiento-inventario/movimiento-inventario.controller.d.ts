import { MovimientoInventarioService } from './movimiento-inventario.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { TipoMovimiento } from '../../common/enums';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class MovimientoInventarioController {
    private readonly movimientoInventarioService;
    constructor(movimientoInventarioService: MovimientoInventarioService);
    create(createMovimientoDto: CreateMovimientoDto): Promise<import("../../entities").MovimientoInventario>;
    findAll(paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").MovimientoInventario>>;
    getMovimientosDelDia(): Promise<{
        movimientos: import("../../entities").MovimientoInventario[];
        totalMovimientos: number;
    }>;
    getEstadisticas(fechaInicio: string, fechaFin: string): Promise<any>;
    findByProducto(codigoBarra: string, paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").MovimientoInventario>>;
    findByTipo(tipo: TipoMovimiento, paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").MovimientoInventario>>;
    findByCajero(cajero: string, paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").MovimientoInventario>>;
    findByDateRange(fechaInicio: string, fechaFin: string, paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").MovimientoInventario>>;
    findOne(id: number): Promise<import("../../entities").MovimientoInventario>;
    registrarEntrada(body: {
        codigoBarra: string;
        cantidad: number;
        costo: number;
        precioVenta: number;
        cajero: string;
        proveedor?: string;
    }): Promise<import("../../entities").MovimientoInventario>;
    registrarAjuste(body: {
        codigoBarra: string;
        nuevaCantidad: number;
        costo: number;
        precioVenta: number;
        cajero: string;
    }): Promise<import("../../entities").MovimientoInventario>;
    registrarVenta(body: {
        codigoBarra: string;
        cantidad: number;
        precioVenta: number;
        cajero: string;
    }): Promise<import("../../entities").MovimientoInventario>;
}
