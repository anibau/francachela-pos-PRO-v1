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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PromocionesService } from './promociones.service';
import { CreatePromocionDto } from './dto/create-promocion.dto';
import { UpdatePromocionDto } from './dto/update-promocion.dto';
// Nuevos imports para promociones unificadas
import { PromocionesUnificadasService } from './promociones-unificadas.service';
import { PromocionEvaluatorService } from './services/promocion-evaluator.service';
import { CreatePromocionUnificadaDto } from './dto/create-promocion-unificada.dto';
import { UpdatePromocionUnificadaDto } from './dto/update-promocion-unificada.dto';
import { EvaluarPromocionesDto } from './dto/evaluar-promociones.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums';
import { TipoPromocion } from '../../entities/promocion.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Promociones')
@Controller('promociones')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PromocionesController {
  constructor(
    private readonly promocionesService: PromocionesService,
    private readonly promocionesUnificadasService: PromocionesUnificadasService,
    private readonly promocionEvaluatorService: PromocionEvaluatorService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear nueva promoción' })
  @ApiResponse({ status: 201, description: 'Promoción creada exitosamente' })
  create(@Body() createPromocionDto: CreatePromocionDto) {
    return this.promocionesService.create(createPromocionDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener todas las promociones' })
  @ApiResponse({ status: 200, description: 'Lista de promociones obtenida exitosamente' })
  findAll() {
    return this.promocionesService.findAll();
  }

  @Get('activas')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener promociones activas' })
  @ApiResponse({ status: 200, description: 'Promociones activas obtenidas exitosamente' })
  findActivas() {
    return this.promocionesService.findActivas();
  }

  @Get('vencidas')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener promociones vencidas' })
  @ApiResponse({ status: 200, description: 'Promociones vencidas obtenidas exitosamente' })
  getVencidas() {
    return this.promocionesService.getPromocionesVencidas();
  }

  @Get('tipo/:tipo')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener promociones por tipo' })
  @ApiResponse({ status: 200, description: 'Promociones por tipo obtenidas exitosamente' })
  findByTipo(@Param('tipo') tipo: TipoPromocion) {
    return this.promocionesService.findByTipo(tipo);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener promoción por ID' })
  @ApiResponse({ status: 200, description: 'Promoción encontrada' })
  @ApiResponse({ status: 404, description: 'Promoción no encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.promocionesService.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar promoción' })
  @ApiResponse({ status: 200, description: 'Promoción actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Promoción no encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updatePromocionDto: UpdatePromocionDto
  ) {
    return this.promocionesService.update(id, updatePromocionDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Desactivar promoción' })
  @ApiResponse({ status: 200, description: 'Promoción desactivada exitosamente' })
  @ApiResponse({ status: 404, description: 'Promoción no encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.promocionesService.remove(id);
  }

  @Patch(':id/activate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Activar promoción' })
  @ApiResponse({ status: 200, description: 'Promoción activada exitosamente' })
  @ApiResponse({ status: 404, description: 'Promoción no encontrada' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.promocionesService.activate(id);
  }

  @Post('desactivar-vencidas')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Desactivar promociones vencidas' })
  @ApiResponse({ status: 200, description: 'Promociones vencidas desactivadas' })
  desactivarVencidas() {
    return this.promocionesService.desactivarVencidas();
  }

  // ========== NUEVOS ENDPOINTS PARA PROMOCIONES UNIFICADAS ==========

  @Post('unificadas')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear nueva promoción unificada (SIMPLE, PACK o COMBO)' })
  @ApiResponse({ status: 201, description: 'Promoción unificada creada exitosamente' })
  createUnificada(@Body() createDto: CreatePromocionUnificadaDto) {
    return this.promocionesUnificadasService.create(createDto);
  }

  @Get('unificadas')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener todas las promociones unificadas' })
  @ApiResponse({ status: 200, description: 'Lista de promociones unificadas obtenida exitosamente' })
  findAllUnificadas() {
    return this.promocionesUnificadasService.findAll();
  }

  @Get('unificadas/activas')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener promociones unificadas activas' })
  @ApiResponse({ status: 200, description: 'Promociones unificadas activas obtenidas exitosamente' })
  findActivasUnificadas() {
    return this.promocionesUnificadasService.findActivas();
  }

  @Get('unificadas/:id')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener promoción unificada por ID' })
  @ApiResponse({ status: 200, description: 'Promoción unificada obtenida exitosamente' })
  @ApiResponse({ status: 404, description: 'Promoción unificada no encontrada' })
  findOneUnificada(@Param('id', ParseIntPipe) id: number) {
    return this.promocionesUnificadasService.findById(id);
  }

  @Patch('unificadas/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar promoción unificada' })
  @ApiResponse({ status: 200, description: 'Promoción unificada actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Promoción unificada no encontrada' })
  updateUnificada(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdatePromocionUnificadaDto,
  ) {
    return this.promocionesUnificadasService.update(id, updateDto);
  }

  @Delete('unificadas/:id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar promoción unificada' })
  @ApiResponse({ status: 200, description: 'Promoción unificada eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Promoción unificada no encontrada' })
  removeUnificada(@Param('id', ParseIntPipe) id: number) {
    return this.promocionesUnificadasService.remove(id);
  }

  @Patch('unificadas/:id/activate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Activar promoción unificada' })
  @ApiResponse({ status: 200, description: 'Promoción unificada activada exitosamente' })
  @ApiResponse({ status: 404, description: 'Promoción unificada no encontrada' })
  activateUnificada(@Param('id', ParseIntPipe) id: number) {
    return this.promocionesUnificadasService.activate(id);
  }

  @Patch('unificadas/:id/deactivate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Desactivar promoción unificada' })
  @ApiResponse({ status: 200, description: 'Promoción unificada desactivada exitosamente' })
  @ApiResponse({ status: 404, description: 'Promoción unificada no encontrada' })
  deactivateUnificada(@Param('id', ParseIntPipe) id: number) {
    return this.promocionesUnificadasService.deactivate(id);
  }

  @Post('evaluar')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Evaluar promociones para un carrito de compras' })
  @ApiResponse({ status: 200, description: 'Evaluación de promociones completada exitosamente' })
  evaluarPromociones(@Body() evaluarDto: EvaluarPromocionesDto) {
    return this.promocionEvaluatorService.evaluarPromociones(evaluarDto);
  }
}
