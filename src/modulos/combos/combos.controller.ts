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
import { CombosService } from './combos.service';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities/usuario.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Combos')
@Controller('combos')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CombosController {
  constructor(private readonly combosService: CombosService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear nuevo combo' })
  @ApiResponse({ status: 201, description: 'Combo creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createComboDto: CreateComboDto) {
    return this.combosService.create(createComboDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener todos los combos' })
  @ApiResponse({ status: 200, description: 'Lista de combos obtenida exitosamente' })
  findAll() {
    return this.combosService.findAll();
  }

  @Get('activos')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener combos activos' })
  @ApiResponse({ status: 200, description: 'Combos activos obtenidos exitosamente' })
  findActivos(@Query() paginationDto: PaginationDto) {
    return this.combosService.findActivos(paginationDto);
  }

  @Get('populares')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener combos más populares' })
  @ApiQuery({ name: 'limit', required: false, description: 'Límite de resultados' })
  @ApiResponse({ status: 200, description: 'Combos populares obtenidos exitosamente' })
  getCombosPopulares(@Query('limit') limit?: number) {
    return this.combosService.getCombosPopulares(limit);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener combo por ID' })
  @ApiResponse({ status: 200, description: 'Combo encontrado' })
  @ApiResponse({ status: 404, description: 'Combo no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.combosService.findById(id);
  }

  @Get(':id/disponibilidad')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Verificar disponibilidad del combo' })
  @ApiResponse({ status: 200, description: 'Disponibilidad verificada' })
  verificarDisponibilidad(@Param('id', ParseIntPipe) id: number) {
    return this.combosService.verificarDisponibilidad(id);
  }

  @Get(':id/ahorro')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Calcular ahorro del combo' })
  @ApiResponse({ status: 200, description: 'Ahorro calculado' })
  calcularAhorro(@Param('id', ParseIntPipe) id: number) {
    return this.combosService.calcularAhorro(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar combo' })
  @ApiResponse({ status: 200, description: 'Combo actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Combo no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateComboDto: UpdateComboDto
  ) {
    return this.combosService.update(id, updateComboDto);
  }

  @Patch(':id/activate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Activar combo' })
  @ApiResponse({ status: 200, description: 'Combo activado exitosamente' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.combosService.activate(id);
  }

  @Patch(':id/deactivate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Desactivar combo' })
  @ApiResponse({ status: 200, description: 'Combo desactivado exitosamente' })
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.combosService.deactivate(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar combo' })
  @ApiResponse({ status: 200, description: 'Combo eliminado exitosamente' })
  @ApiResponse({ status: 404, description: 'Combo no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.combosService.remove(id);
  }
}

