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
  BadRequestException,
  Logger
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CajaService } from './caja.service';
import { AbrirCajaDto } from './dto/abrir-caja.dto';
import { CerrarCajaDto } from './dto/cerrar-caja.dto';
import { CajaEstadisticasDto } from './dto/caja-estadisticas.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole, Usuario } from '../../entities/usuario.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Caja')
@Controller('caja')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CajaController {
  private readonly logger = new Logger(CajaController.name);

  constructor(private readonly cajaService: CajaService) {}

  @Post('abrir')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Abrir caja registradora' })
  @ApiResponse({ status: 201, description: 'Caja abierta exitosamente' })
  @ApiResponse({ status: 400, description: 'Ya existe una caja abierta' })
  abrirCaja(@Body() abrirCajaDto: AbrirCajaDto, @CurrentUser() user: Usuario) {
    return this.cajaService.abrirCaja(abrirCajaDto, user.username);
  }

  @Patch(':id/cerrar')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Cerrar caja registradora' })
  @ApiResponse({ status: 200, description: 'Caja cerrada exitosamente' })
  @ApiResponse({ status: 400, description: 'La caja ya está cerrada' })
  @ApiResponse({ status: 404, description: 'Caja no encontrada' })
  cerrarCaja(
    @Param('id', ParseIntPipe) id: number,
    @Body() cerrarCajaDto: CerrarCajaDto
  ) {
    return this.cajaService.cerrarCaja(id, cerrarCajaDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener historial de cajas' })
  @ApiResponse({ status: 200, description: 'Historial de cajas obtenido exitosamente' })
  findAll() {
    return this.cajaService.findAll();
  }

  @Get('actual')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener caja actual del cajero' })
  @ApiResponse({ status: 200, description: 'Caja actual obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'No hay caja abierta' })
  getCajaActual(@CurrentUser() user: Usuario) {
    return this.cajaService.getCajaActual(user.username);
  }

  @Get('resumen')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener resumen de la caja actual' })
  @ApiResponse({ status: 200, description: 'Resumen de caja obtenido exitosamente' })
  @ApiResponse({ status: 404, description: 'No hay caja abierta' })
  getResumenCajaActual(@CurrentUser() user: Usuario) {
    return this.cajaService.getResumenCajaActual(user.username);
  }

  @Get('estadisticas')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener estadísticas de cajas por rango de fechas' })
  @ApiQuery({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD HH:mm:ss)', required: false })
  @ApiQuery({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD HH:mm:ss)', required: false })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente' })
  @ApiResponse({ status: 400, description: 'Parámetros de fecha inválidos' })
  async getEstadisticas(@Query() cajaEstadisticasDto: CajaEstadisticasDto) {
    try {
      const { fechaInicio, fechaFin } = cajaEstadisticasDto.getDateRange();
      this.logger.log(`Obteniendo estadísticas de cajas desde ${fechaInicio.toISOString()} hasta ${fechaFin.toISOString()}`);
      
      return await this.cajaService.getEstadisticasCajas(fechaInicio, fechaFin);
    } catch (error) {
      this.logger.error('Error obteniendo estadísticas de cajas:', error);
      throw new BadRequestException('Error procesando parámetros de fecha: ' + error.message);
    }
  }

  @Get('rango')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener cajas por rango de fechas' })
  @ApiQuery({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD HH:mm:ss)', required: false })
  @ApiQuery({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD HH:mm:ss)', required: false })
  @ApiResponse({ status: 200, description: 'Cajas del rango obtenidas exitosamente' })
  @ApiResponse({ status: 400, description: 'Parámetros de fecha inválidos' })
  async getCajasPorFecha(@Query() cajaEstadisticasDto: CajaEstadisticasDto) {
    try {
      const { fechaInicio, fechaFin } = cajaEstadisticasDto.getDateRange();
      this.logger.log(`Obteniendo cajas desde ${fechaInicio.toISOString()} hasta ${fechaFin.toISOString()}`);
      
      return await this.cajaService.getCajasPorFecha(fechaInicio, fechaFin);
    } catch (error) {
      this.logger.error('Error obteniendo cajas por fecha:', error);
      throw new BadRequestException('Error procesando parámetros de fecha: ' + error.message);
    }
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener caja por ID' })
  @ApiResponse({ status: 200, description: 'Caja encontrada' })
  @ApiResponse({ status: 404, description: 'Caja no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cajaService.findById(id);
  }
}
