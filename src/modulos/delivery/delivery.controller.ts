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
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto, EstadoDelivery } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities/usuario.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Delivery')
@Controller('delivery')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Crear nuevo delivery' })
  @ApiResponse({ status: 201, description: 'Delivery creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveryService.create(createDeliveryDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener todos los deliveries' })
  @ApiResponse({ status: 200, description: 'Lista de deliveries obtenida exitosamente' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.deliveryService.findAll(paginationDto);
  }

  @Get('hoy')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener deliveries del día actual' })
  @ApiResponse({ status: 200, description: 'Deliveries del día obtenidos exitosamente' })
  getDeliveriesDelDia() {
    return this.deliveryService.getDeliveriesDelDia();
  }

  @Get('repartidores')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener lista de repartidores' })
  @ApiResponse({ status: 200, description: 'Repartidores obtenidos exitosamente' })
  getRepartidores() {
    return this.deliveryService.getRepartidores();
  }

  @Get('estadisticas')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener estadísticas de delivery por rango de fechas' })
  @ApiQuery({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente' })
  getEstadisticas(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return this.deliveryService.getEstadisticasDelivery(inicio, fin);
  }

  @Get('estado/:estado')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener deliveries por estado' })
  @ApiResponse({ status: 200, description: 'Deliveries por estado obtenidos exitosamente' })
  findByEstado(
    @Param('estado') estado: EstadoDelivery,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.deliveryService.findByEstado(estado, paginationDto);
  }

  @Get('repartidor/:repartidor')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener deliveries por repartidor' })
  @ApiResponse({ status: 200, description: 'Deliveries del repartidor obtenidos exitosamente' })
  findByRepartidor(
    @Param('repartidor') repartidor: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.deliveryService.findByRepartidor(repartidor, paginationDto);
  }

  @Get('rango')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener deliveries por rango de fechas' })
  @ApiQuery({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Deliveries del rango obtenidos exitosamente' })
  findByDateRange(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
    @Query() paginationDto: PaginationDto,
  ) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return this.deliveryService.findByDateRange(inicio, fin, paginationDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener delivery por ID' })
  @ApiResponse({ status: 200, description: 'Delivery encontrado' })
  @ApiResponse({ status: 404, description: 'Delivery no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.deliveryService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Actualizar delivery' })
  @ApiResponse({ status: 200, description: 'Delivery actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Delivery no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateDeliveryDto: UpdateDeliveryDto
  ) {
    return this.deliveryService.update(id, updateDeliveryDto);
  }

  @Patch(':id/asignar')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Asignar repartidor a delivery' })
  @ApiResponse({ status: 200, description: 'Repartidor asignado exitosamente' })
  asignarRepartidor(
    @Param('id', ParseIntPipe) id: number,
    @Body('repartidor') repartidor: string
  ) {
    return this.deliveryService.asignarRepartidor(id, repartidor);
  }

  @Patch(':id/en-camino')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Marcar delivery en camino' })
  @ApiResponse({ status: 200, description: 'Delivery marcado en camino' })
  marcarEnCamino(
    @Param('id', ParseIntPipe) id: number,
    @Body('horaSalida') horaSalida: string
  ) {
    return this.deliveryService.marcarEnCamino(id, horaSalida);
  }

  @Patch(':id/entregado')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Marcar delivery como entregado' })
  @ApiResponse({ status: 200, description: 'Delivery marcado como entregado' })
  marcarEntregado(
    @Param('id', ParseIntPipe) id: number,
    @Body('horaEntrega') horaEntrega: string
  ) {
    return this.deliveryService.marcarEntregado(id, horaEntrega);
  }

  @Patch(':id/cancelar')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Cancelar delivery' })
  @ApiResponse({ status: 200, description: 'Delivery cancelado exitosamente' })
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.deliveryService.cancelar(id);
  }
}

