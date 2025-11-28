import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  UseGuards, 
  Query,
  ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole, Usuario } from '../entities/usuario.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@ApiTags('Ventas')
@Controller('ventas')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Crear nueva venta' })
  @ApiResponse({ status: 201, description: 'Venta creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de venta inválidos' })
  create(@Body() createVentaDto: CreateVentaDto, @CurrentUser() user: Usuario) {
    return this.ventasService.create(createVentaDto, user.username);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener todas las ventas' })
  @ApiResponse({ status: 200, description: 'Lista de ventas obtenida exitosamente' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.ventasService.findAll(paginationDto);
  }

  @Get('hoy')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener ventas del día actual' })
  @ApiResponse({ status: 200, description: 'Ventas del día obtenidas exitosamente' })
  getVentasDelDia() {
    return this.ventasService.getVentasDelDia();
  }

  @Get('estadisticas')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener estadísticas de ventas por rango de fechas' })
  @ApiQuery({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente' })
  getEstadisticas(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return this.ventasService.getEstadisticasVentas(inicio, fin);
  }

  @Get('rango')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener ventas por rango de fechas' })
  @ApiQuery({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Ventas del rango obtenidas exitosamente' })
  findByDateRange(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query() paginationDto: PaginationDto,
  ) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return this.ventasService.findByDateRange(inicio, fin, paginationDto);
  }

  @Get('cliente/:clienteId')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener ventas de un cliente específico' })
  @ApiResponse({ status: 200, description: 'Ventas del cliente obtenidas exitosamente' })
  findByCliente(
    @Param('clienteId', ParseIntPipe) clienteId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.ventasService.findByCliente(clienteId, paginationDto);
  }

  @Get('ticket/:ticketId')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener venta por ticket ID' })
  @ApiResponse({ status: 200, description: 'Venta encontrada' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  findByTicketId(@Param('ticketId') ticketId: string) {
    return this.ventasService.findByTicketId(ticketId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener venta por ID' })
  @ApiResponse({ status: 200, description: 'Venta encontrada' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.findById(id);
  }

  @Patch(':id/anular')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Anular venta' })
  @ApiResponse({ status: 200, description: 'Venta anulada exitosamente' })
  @ApiResponse({ status: 400, description: 'La venta ya está anulada' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  anularVenta(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: Usuario) {
    return this.ventasService.anularVenta(id, user.username);
  }
}

