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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../entities/usuario.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { TipoPromocion } from '../entities/promocion.entity';

@ApiTags('Promociones')
@Controller('promociones')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PromocionesController {
  constructor(private readonly promocionesService: PromocionesService) {}

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
  findAll(@Query() paginationDto: PaginationDto) {
    return this.promocionesService.findAll(paginationDto);
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
}

