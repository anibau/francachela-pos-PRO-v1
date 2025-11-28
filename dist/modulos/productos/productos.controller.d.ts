import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ActualizarStockDto } from './dto/actualizar-stock.dto';
import { Usuario } from '../../entities/usuario.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class ProductosController {
    private readonly productosService;
    constructor(productosService: ProductosService);
    create(createProductoDto: CreateProductoDto, user: Usuario): Promise<import("../../entities").Producto>;
    findAll(paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").Producto>>;
    search(query: string, paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").Producto>>;
    getCategorias(): Promise<string[]>;
    getStockBajo(): Promise<import("../../entities").Producto[]>;
    findByCategoria(categoria: string, paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").Producto>>;
    findByCodigoBarra(codigoBarra: string): Promise<import("../../entities").Producto>;
    getMovimientosInventario(paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").MovimientoInventario>>;
    getMovimientosByProducto(codigoBarra: string, paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities").MovimientoInventario>>;
    findOne(id: number): Promise<import("../../entities").Producto>;
    update(id: number, updateProductoDto: UpdateProductoDto): Promise<import("../../entities").Producto>;
    actualizarStock(id: number, actualizarStockDto: ActualizarStockDto, user: Usuario): Promise<import("../../entities").Producto>;
    remove(id: number): Promise<void>;
    activate(id: number): Promise<import("../../entities").Producto>;
}
