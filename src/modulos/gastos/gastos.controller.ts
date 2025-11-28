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
import { GastosService } from './gastos.service';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole, Usuario } from '../../entities/usuario.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { CategoriaGasto } from '../../entities/gasto.entity';

@ApiTags('Gastos')
@Controller('gastos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class GastosController {
  constructor(private readonly gastosService: GastosService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Registrar nuevo gasto' })
  @ApiResponse({ status: 201, description: 'Gasto registrado exitosamente' })
  create(@Body() createGastoDto: CreateGastoDto, @CurrentUser() user: Usuario) {
    return this.gastosService.create(createGastoDto, user.username);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener todos los gastos' })
  @ApiResponse({ status: 200, description: 'Lista de gastos obtenida exitosamente' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.gastosService.findAll(paginationDto);
  }

  @Get('hoy')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener gastos del día actual' })
  @ApiResponse({ status: 200, description: 'Gastos del día obtenidos exitosamente' })
  getGastosDelDia() {
    return this.gastosService.getGastosDelDia();
  }

  @Get('categorias')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener categorías de gastos disponibles' })
  @ApiResponse({ status: 200, description: 'Categorías obtenidas exitosamente' })
  getCategorias() {
    return this.gastosService.getCategorias();
  }

  @Get('estadisticas')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener estadísticas de gastos por rango de fechas' })
  @ApiQuery({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente' })
  getEstadisticas(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return this.gastosService.getEstadisticasGastos(inicio, fin);
  }

  @Get('search')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Buscar gastos por descripción, proveedor o comprobante' })
  @ApiQuery({ name: 'q', description: 'Término de búsqueda' })
  @ApiResponse({ status: 200, description: 'Resultados de búsqueda obtenidos exitosamente' })
  search(@Query('q') query: string, @Query() paginationDto: PaginationDto) {
    return this.gastosService.search(query, paginationDto);
  }

  @Get('rango')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener gastos por rango de fechas' })
  @ApiQuery({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Gastos del rango obtenidos exitosamente' })
  findByDateRange(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query() paginationDto: PaginationDto,
  ) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return this.gastosService.findByDateRange(inicio, fin, paginationDto);
  }

  @Get('categoria/:categoria')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener gastos por categoría' })
  @ApiResponse({ status: 200, description: 'Gastos por categoría obtenidos exitosamente' })
  findByCategoria(
    @Param('categoria') categoria: CategoriaGasto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.gastosService.findByCategoria(categoria, paginationDto);
  }

  @Get('cajero/:cajero')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener gastos por cajero' })
  @ApiResponse({ status: 200, description: 'Gastos del cajero obtenidos exitosamente' })
  findByCajero(
    @Param('cajero') cajero: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.gastosService.findByCajero(cajero, paginationDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener gasto por ID' })
  @ApiResponse({ status: 200, description: 'Gasto encontrado' })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gastosService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Actualizar gasto' })
  @ApiResponse({ status: 200, description: 'Gasto actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateGastoDto: UpdateGastoDto
  ) {
    return this.gastosService.update(id, updateGastoDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar gasto' })
  @ApiResponse({ status: 200, description: 'Gasto eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Gasto no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.gastosService.remove(id);
  }
}

