import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards, 
  Query,
  ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MovimientoInventarioService } from './movimiento-inventario.service';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole, TipoMovimiento } from '../../common/enums';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { DateRangeDto, PaginasRangoDto } from '../../common/dto/date-range.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Usuario } from '../../entities/usuario.entity';
import { RegistrarEntradaDto } from './dto/registrar-entrada.dto';
import { RegistrarAjusteDto } from './dto/registrar-ajuste.dto';
import { RegistrarVentaMovimientoDto } from './dto/registrar-venta-movimiento.dto';

@ApiTags('Movimiento Inventario')
@Controller('movimiento-inventario')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MovimientoInventarioController {
  constructor(private readonly movimientoInventarioService: MovimientoInventarioService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Crear nuevo movimiento de inventario' })
  @ApiResponse({ status: 201, description: 'Movimiento creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o stock insuficiente' })
  create(
    @Body() createMovimientoDto: CreateMovimientoDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.movimientoInventarioService.create(
      createMovimientoDto,
      user.username,
    );
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.INVENTARIOS, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener todos los movimientos de inventario' })
  @ApiResponse({ status: 200, description: 'Lista de movimientos obtenida exitosamente' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.movimientoInventarioService.findAll(paginationDto);
  }

  @Get('hoy')
  @Roles(UserRole.ADMIN, UserRole.INVENTARIOS, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener movimientos del día actual' })
  @ApiResponse({ status: 200, description: 'Movimientos del día obtenidos exitosamente' })
  getMovimientosDelDia() {
    return this.movimientoInventarioService.getMovimientosDelDia();
  }

  @Get('estadisticas')
  @Roles(UserRole.ADMIN, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Obtener estadísticas de movimientos por rango de fechas' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente' })
  getEstadisticas(@Query() dateRangeDto: DateRangeDto) {
    const { fechaInicio, fechaFin } = dateRangeDto.getDateRange();
    return this.movimientoInventarioService.getEstadisticasMovimientos(fechaInicio, fechaFin);
  }

  @Get('producto/:codigoBarra')
  @Roles(UserRole.ADMIN, UserRole.INVENTARIOS, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener movimientos por producto' })
  @ApiResponse({ status: 200, description: 'Movimientos del producto obtenidos exitosamente' })
  findByProducto(
    @Param('codigoBarra') codigoBarra: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.movimientoInventarioService.findByProducto(codigoBarra, paginationDto);
  }

  @Get('tipo/:tipo')
  @Roles(UserRole.ADMIN, UserRole.INVENTARIOS, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener movimientos por tipo' })
  @ApiResponse({ status: 200, description: 'Movimientos por tipo obtenidos exitosamente' })
  findByTipo(
    @Param('tipo') tipo: TipoMovimiento,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.movimientoInventarioService.findByTipo(tipo, paginationDto);
  }

  @Get('cajero/:cajero')
  @Roles(UserRole.ADMIN, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Obtener movimientos por cajero' })
  @ApiResponse({ status: 200, description: 'Movimientos del cajero obtenidos exitosamente' })
  findByCajero(
    @Param('cajero') cajero: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.movimientoInventarioService.findByCajero(cajero, paginationDto);
  }

  @Get('rango')
  @Roles(UserRole.ADMIN, UserRole.INVENTARIOS, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener movimientos por rango de fechas' })
  @ApiResponse({ status: 200, description: 'Movimientos del rango obtenidos exitosamente' })
  findByDateRange(
   @Query() dateRangeDto: PaginasRangoDto
  ) {
    const { fechaInicio, fechaFin } = dateRangeDto.getDateRange();
    const paginationDto = new PaginationDto();
    paginationDto.page = dateRangeDto.page;
    paginationDto.limit = dateRangeDto.limit;
    return this.movimientoInventarioService.findByDateRange(
      fechaInicio,
      fechaFin,
      paginationDto,
    );
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.INVENTARIOS, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener movimiento por ID' })
  @ApiResponse({ status: 200, description: 'Movimiento encontrado' })
  @ApiResponse({ status: 404, description: 'Movimiento no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.movimientoInventarioService.findById(id);
  }

  @Post('entrada')
  @Roles(UserRole.ADMIN, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Registrar entrada de mercancía' })
  @ApiResponse({ status: 201, description: 'Entrada registrada exitosamente' })
  registrarEntrada(
    @Body() body: RegistrarEntradaDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.movimientoInventarioService.registrarEntrada(
      body.codigoBarra,
      body.cantidad,
      body.costo,
      body.precioVenta,
      user.username,
      body.proveedor,
    );
  }

  @Post('ajuste')
  @Roles(UserRole.ADMIN, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Registrar ajuste de inventario' })
  @ApiResponse({ status: 201, description: 'Ajuste registrado exitosamente' })
  registrarAjuste(
    @Body() body: RegistrarAjusteDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.movimientoInventarioService.registrarAjuste(
      body.codigoBarra,
      body.nuevaCantidad,
      body.costo,
      body.precioVenta,
      user.username,
    );
  }

  @Post('venta')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Registrar salida por venta' })
  @ApiResponse({ status: 201, description: 'Venta registrada exitosamente' })
  registrarVenta(
    @Body() body: RegistrarVentaMovimientoDto,
    @CurrentUser() user: Usuario,
  ) {
    return this.movimientoInventarioService.registrarVenta(
      body.codigoBarra,
      body.cantidad,
      body.precioVenta,
      user.username,
    );
  }
}
