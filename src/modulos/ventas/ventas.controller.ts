import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  UseGuards, 
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole, Usuario } from '../../entities/usuario.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

/**
 * Controlador de Ventas
 * Maneja todos los endpoints relacionados con ventas:
 * - Crear nuevas ventas
 * - Consultar ventas por diversos criterios
 * - Anular ventas
 * - Obtener estadísticas
 */
@ApiTags('Ventas')
@Controller('ventas')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  /**
   * Crear una nueva venta
   * - Valida cliente, productos y disponibilidad
   * - Descuenta stock del inventario
   * - Actualiza puntos del cliente
   * - Envía notificación por WhatsApp
   */
  @Post()
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear nueva venta',
    description: 'Crea una venta con validaciones completas. Puede ser anónima o de cliente registrado.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Venta creada exitosamente',
    schema: {
      example: {
        id: 1,
        ticketId: '20241205-0001',
        total: 20.00,
        puntosOtorgados: 20,
        estado: 'COMPLETADO'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o stock insuficiente' })
  @ApiResponse({ status: 404, description: 'Cliente o producto no encontrado' })
  create(@Body() createVentaDto: CreateVentaDto, @CurrentUser() user: Usuario) {
    return this.ventasService.create(createVentaDto, user.username);
  }

  /**
   * Obtener todas las ventas con paginación
   */
  @Get()
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ 
    summary: 'Obtener todas las ventas',
    description: 'Retorna un listado paginado de todas las ventas del sistema'
  })
  @ApiResponse({ status: 200, description: 'Lista de ventas obtenida exitosamente' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.ventasService.findAll(paginationDto);
  }

  /**
   * Obtener ventas del día actual
   */
  @Get('hoy')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ 
    summary: 'Obtener ventas del día actual',
    description: 'Retorna todas las ventas completadas del día actual con resumen'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Ventas del día obtenidas exitosamente',
    schema: {
      example: {
        ventas: [],
        totalVentas: 5,
        totalMonto: 150.50
      }
    }
  })
  getVentasDelDia() {
    return this.ventasService.getVentasDelDia();
  }

  /**
   * Obtener estadísticas de ventas por rango de fechas
   */
  @Get('estadisticas')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ 
    summary: 'Obtener estadísticas de ventas',
    description: 'Retorna estadísticas detalladas (total, promedio, métodos de pago, top productos)'
  })
  @ApiQuery({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD)', example: '2024-12-01' })
  @ApiQuery({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD)', example: '2024-12-05' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente' })
  getEstadisticas(
    @Query('fechaInicio') fechaInicio: string,
    @Query('fechaFin') fechaFin: string,
  ) {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    return this.ventasService.getEstadisticasVentas(inicio, fin);
  }

  /**
   * Obtener ventas por rango de fechas
   */
  @Get('rango')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ 
    summary: 'Obtener ventas por rango de fechas',
    description: 'Retorna un listado paginado de ventas dentro de un rango de fechas'
  })
  @ApiQuery({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
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

  /**
   * Obtener ventas de un cliente específico
   */
  @Get('cliente/:clienteId')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ 
    summary: 'Obtener ventas de un cliente',
    description: 'Retorna historial de compras de un cliente específico'
  })
  @ApiResponse({ status: 200, description: 'Ventas del cliente obtenidas exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  findByCliente(
    @Param('clienteId', ParseIntPipe) clienteId: number,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.ventasService.findByCliente(clienteId, paginationDto);
  }

  /**
   * Obtener venta por ticket ID
   */
  @Get('ticket/:ticketId')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ 
    summary: 'Obtener venta por ticket ID',
    description: 'Retorna los detalles de una venta usando su número de ticket único'
  })
  @ApiResponse({ status: 200, description: 'Venta encontrada' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  findByTicketId(@Param('ticketId') ticketId: string) {
    return this.ventasService.findByTicketId(ticketId);
  }

  /**
   * Obtener venta por ID
   */
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ 
    summary: 'Obtener venta por ID',
    description: 'Retorna los detalles completos de una venta por su ID'
  })
  @ApiResponse({ status: 200, description: 'Venta encontrada' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.findById(id);
  }

  /**
   * Anular una venta
   * - Devuelve stock de productos
   * - Revierte puntos del cliente
   * - Envía notificación por WhatsApp
   */
  @Patch(':id/anular')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Anular venta',
    description: 'Anula una venta completada y revierte todos sus efectos (stock, puntos, etc.)'
  })
  @ApiResponse({ status: 200, description: 'Venta anulada exitosamente' })
  @ApiResponse({ status: 400, description: 'La venta ya está anulada' })
  @ApiResponse({ status: 404, description: 'Venta no encontrada' })
  anularVenta(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: Usuario) {
    return this.ventasService.anularVenta(id, user.username);
  }
}

