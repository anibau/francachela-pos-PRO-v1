import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  UseGuards,
  Delete 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WhatsappService } from './whatsapp.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities/usuario.entity';

@ApiTags('WhatsApp')
@Controller('whatsapp')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('send')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Enviar mensaje de WhatsApp' })
  @ApiResponse({ status: 201, description: 'Mensaje enviado exitosamente' })
  @ApiResponse({ status: 400, description: 'Error enviando mensaje' })
  sendMessage(@Body() sendMessageDto: SendMessageDto) {
    return this.whatsappService.sendMessage(sendMessageDto);
  }

  @Post('send-venta')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Enviar notificación de venta' })
  @ApiResponse({ status: 201, description: 'Notificación enviada exitosamente' })
  sendVentaNotification(@Body() body: {
    phone: string;
    total: number;
    puntosGanados: number;
    ventaId: number;
  }) {
    return this.whatsappService.sendVentaNotification(
      body.phone,
      body.total,
      body.puntosGanados,
      body.ventaId
    );
  }

  @Post('send-combo')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Enviar notificación de combo' })
  @ApiResponse({ status: 201, description: 'Notificación de combo enviada' })
  sendComboNotification(@Body() body: {
    phone: string;
    comboNombre: string;
    ahorro: number;
    total: number;
  }) {
    return this.whatsappService.sendComboNotification(
      body.phone,
      body.comboNombre,
      body.ahorro,
      body.total
    );
  }

  @Post('send-delivery')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Enviar notificación de delivery' })
  @ApiResponse({ status: 201, description: 'Notificación de delivery enviada' })
  sendDeliveryNotification(@Body() body: {
    phone: string;
    direccion: string;
    repartidor: string;
    tiempoEstimado?: string;
  }) {
    return this.whatsappService.sendDeliveryNotification(
      body.phone,
      body.direccion,
      body.repartidor,
      body.tiempoEstimado
    );
  }

  @Post('send-stock-alert')
  @Roles(UserRole.ADMIN, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Enviar alerta de stock bajo' })
  @ApiResponse({ status: 201, description: 'Alerta enviada exitosamente' })
  sendLowStockAlert(@Body() body: {
    adminPhone: string;
    productos: Array<{ nombre: string; stock: number; minimo: number }>;
  }) {
    return this.whatsappService.sendLowStockAlert(
      body.adminPhone,
      body.productos
    );
  }

  @Get('status')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Obtener estado de conexión de WhatsApp' })
  @ApiResponse({ status: 200, description: 'Estado obtenido exitosamente' })
  getStatus() {
    return this.whatsappService.getConnectionStatus();
  }

  @Get('qr')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener código QR para conexión' })
  @ApiResponse({ status: 200, description: 'QR obtenido exitosamente' })
  getQR() {
    return this.whatsappService.getQR();
  }

  @Post('reconnect')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Reconectar WhatsApp manualmente' })
  @ApiResponse({ status: 200, description: 'Reconexión iniciada' })
  reconnect() {
    return this.whatsappService.reconnect();
  }

  @Delete('logout')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cerrar sesión de WhatsApp' })
  @ApiResponse({ status: 200, description: 'Sesión cerrada exitosamente' })
  logout() {
    return this.whatsappService.logout();
  }
}

