import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Query,
  ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ActualizarStockDto } from './dto/actualizar-stock.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole, Usuario } from '../../entities/usuario.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Productos')
@Controller('productos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Crear nuevo producto' })
  @ApiResponse({ status: 201, description: 'Producto creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El código de barras ya existe' })
  create(@Body() createProductoDto: CreateProductoDto, @CurrentUser() user: Usuario) {
    return this.productosService.create(createProductoDto, user.username);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.CAJERO, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Obtener todos los productos' })
  @ApiResponse({ status: 200, description: 'Lista de productos obtenida exitosamente' })
  findAll() {
    return this.productosService.findAll();
  }

  @Get('search')
  @Roles(UserRole.ADMIN, UserRole.CAJERO, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Buscar productos por descripción, código de barras, categoría o proveedor' })
  @ApiQuery({ name: 'q', description: 'Término de búsqueda' })
  @ApiResponse({ status: 200, description: 'Resultados de búsqueda obtenidos exitosamente' })
  search(@Query('q') query: string, @Query() paginationDto: PaginationDto) {
    return this.productosService.search(query, paginationDto);
  }

  @Get('categorias')
  @Roles(UserRole.ADMIN, UserRole.CAJERO, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Obtener todas las categorías de productos' })
  @ApiResponse({ status: 200, description: 'Lista de categorías obtenida exitosamente' })
  getCategorias() {
    return this.productosService.getCategorias();
  }

  @Get('stock-bajo')
  @Roles(UserRole.ADMIN, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Obtener productos con stock bajo' })
  @ApiResponse({ status: 200, description: 'Lista de productos con stock bajo obtenida exitosamente' })
  getStockBajo() {
    return this.productosService.findStockBajo();
  }

  @Get('categoria/:categoria')
  @Roles(UserRole.ADMIN, UserRole.CAJERO, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Obtener productos por categoría' })
  @ApiResponse({ status: 200, description: 'Productos de la categoría obtenidos exitosamente' })
  findByCategoria(@Param('categoria') categoria: string, @Query() paginationDto: PaginationDto) {
    return this.productosService.findByCategoria(categoria, paginationDto);
  }

  @Get('proveedor/:proveedor')
  @Roles(UserRole.ADMIN, UserRole.CAJERO, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Obtener productos por proveedor' })
  @ApiResponse({ status: 200, description: 'Productos del proveedor obtenidos exitosamente' })
  findByProveedor(@Param('proveedor') proveedor: string, @Query() paginationDto: PaginationDto) {
    return this.productosService.findByProveedor(proveedor, paginationDto);
  }

  @Get('codigo/:codigoBarra')
  @Roles(UserRole.ADMIN, UserRole.CAJERO, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Obtener producto por código de barras' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findByCodigoBarra(@Param('codigoBarra') codigoBarra: string) {
    return this.productosService.findByCodigoBarra(codigoBarra);
  }

  @Get('movimientos')
  @Roles(UserRole.ADMIN, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Obtener historial de movimientos de inventario' })
  @ApiResponse({ status: 200, description: 'Historial de movimientos obtenido exitosamente' })
  getMovimientosInventario(@Query() paginationDto: PaginationDto) {
    return this.productosService.getMovimientosInventario(paginationDto);
  }

  @Get('movimientos/:codigoBarra')
  @Roles(UserRole.ADMIN, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Obtener movimientos de inventario por producto' })
  @ApiResponse({ status: 200, description: 'Movimientos del producto obtenidos exitosamente' })
  getMovimientosByProducto(@Param('codigoBarra') codigoBarra: string, @Query() paginationDto: PaginationDto) {
    return this.productosService.getMovimientosByProducto(codigoBarra, paginationDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CAJERO, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Actualizar producto' })
  @ApiResponse({ status: 200, description: 'Producto actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateProductoDto: UpdateProductoDto
  ) {
    return this.productosService.update(id, updateProductoDto);
  }

  @Patch(':id/stock')
  @Roles(UserRole.ADMIN, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Actualizar stock del producto' })
  @ApiResponse({ status: 200, description: 'Stock actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  actualizarStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() actualizarStockDto: ActualizarStockDto,
    @CurrentUser() user: Usuario
  ) {
    return this.productosService.actualizarStock(id, actualizarStockDto, user.username);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Ocultar producto (soft delete)' })
  @ApiResponse({ status: 200, description: 'Producto ocultado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.remove(id);
  }

  @Patch(':id/activate')
  @Roles(UserRole.ADMIN, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Mostrar producto nuevamente' })
  @ApiResponse({ status: 200, description: 'Producto activado exitosamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.activate(id);
  }
}

