import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities/usuario.entity';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('sync-sequences')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Sincronizar todas las secuencias de la base de datos',
    description: 'Resincroniza las secuencias de todas las tablas. Necesario después de cargar datos manualmente con pgAdmin.',
  })
  @ApiResponse({
    status: 200,
    description: 'Secuencias sincronizadas exitosamente',
  })
  async syncAllSequences() {
    return this.adminService.syncAllSequences();
  }

  @Get('sequence-status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Obtener estado de todas las secuencias',
    description: 'Verifica que todas las secuencias de la BD estén sincronizadas correctamente',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado de secuencias obtenido',
  })
  async getSequenceStatus() {
    return this.adminService.getSequenceStatus();
  }

  @Post('sync-sequence/:tableName')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Sincronizar secuencia de una tabla específica',
    description: 'Resincroniza la secuencia de una tabla individual',
  })
  @ApiResponse({
    status: 200,
    description: 'Secuencia sincronizada',
  })
  async syncSequenceForTable(@Param('tableName') tableName: string) {
    return this.adminService.syncSequenceForTable(tableName);
  }
}
