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
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities/usuario.entity';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Clientes')
@Controller('clientes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Crear nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Cliente creado exitosamente' })
  @ApiResponse({ status: 409, description: 'El DNI ya está registrado' })
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener todos los clientes' })
  @ApiResponse({ status: 200, description: 'Lista de clientes obtenida exitosamente' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.clientesService.findAll(paginationDto);
  }

  @Get('search')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Buscar clientes por nombre, apellido, DNI, teléfono o código' })
  @ApiQuery({ name: 'q', description: 'Término de búsqueda' })
  @ApiResponse({ status: 200, description: 'Resultados de búsqueda obtenidos exitosamente' })
  search(@Query('q') query: string, @Query() paginationDto: PaginationDto) {
    return this.clientesService.search(query, paginationDto);
  }

  @Get('cumpleaneros')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener clientes que cumplen años hoy' })
  @ApiResponse({ status: 200, description: 'Lista de cumpleañeros obtenida exitosamente' })
  getCumpleaneros() {
    return this.clientesService.findCumpleaneros();
  }

  @Get('top')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener clientes con más puntos' })
  @ApiQuery({ name: 'limit', required: false, description: 'Número de clientes a obtener', example: 10 })
  @ApiResponse({ status: 200, description: 'Top clientes obtenidos exitosamente' })
  getTopClientes(@Query('limit') limit?: number) {
    return this.clientesService.findTopClientes(limit);
  }

  @Get('dni/:dni')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener cliente por DNI' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  findByDni(@Param('dni') dni: string) {
    return this.clientesService.findByDni(dni);
  }

  @Get('codigo/:codigoCorto')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener cliente por código corto' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  findByCodigoCorto(@Param('codigoCorto') codigoCorto: string) {
    return this.clientesService.findByCodigoCorto(codigoCorto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener cliente por ID' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.findById(id);
  }

  @Get(':id/estadisticas')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener estadísticas del cliente' })
  @ApiResponse({ status: 200, description: 'Estadísticas del cliente obtenidas exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  getEstadisticas(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.getEstadisticasCliente(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Actualizar cliente' })
  @ApiResponse({ status: 200, description: 'Cliente actualizado exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateClienteDto: UpdateClienteDto
  ) {
    return this.clientesService.update(id, updateClienteDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Desactivar cliente (soft delete)' })
  @ApiResponse({ status: 200, description: 'Cliente desactivado exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.remove(id);
  }

  @Patch(':id/activate')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Activar cliente nuevamente' })
  @ApiResponse({ status: 200, description: 'Cliente activado exitosamente' })
  @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.activate(id);
  }
}

