import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  UseGuards,
  Delete,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WhatsappService } from './whatsapp.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities/usuario.entity';
import { ClientesService } from '../clientes/clientes.service';

@ApiTags('WhatsApp')
@Controller('whatsapp')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WhatsappController {
  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly clientesService: ClientesService
  ) {}

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
    ventaId: string;
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

  @Post('send-welcome')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Enviar mensaje de bienvenida a nuevo cliente' })
  @ApiResponse({ status: 201, description: 'Mensaje de bienvenida enviado exitosamente' })
  sendWelcomeMessage(@Body() body: {
    phone: string;
    nombres: string;
    apellidos: string;
    codigoCorto: string;
  }) {
    return this.whatsappService.sendWelcomeMessage(
      body.phone,
      body.nombres,
      body.apellidos,
      body.codigoCorto
    );
  }

  /**
   * Enviar mensajes de cumpleaños a clientes
   * - Busca clientes que cumplen años hoy
   * - Envía mensaje personalizado por WhatsApp
   * - Evita duplicados verificando envíos previos
   */
  @Post('birthday')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Enviar mensajes de cumpleaños',
    description: 'Envía mensajes de felicitación a todos los clientes que cumplen años hoy'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Mensajes de cumpleaños enviados exitosamente',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        clientesEncontrados: { type: 'number', example: 3 },
        mensajesEnviados: { type: 'number', example: 2 },
        errores: { type: 'number', example: 1 },
        detalles: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              clienteId: { type: 'number', example: 1 },
              nombre: { type: 'string', example: 'Juan Pérez' },
              telefono: { type: 'string', example: '987654321' },
              edad: { type: 'number', example: 25 },
              enviado: { type: 'boolean', example: true },
              error: { type: 'string', example: null }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async sendBirthdayMessages() {
    try {
      // Obtener clientes que cumplen años hoy
      const cumpleaneros = await this.clientesService.findCumpleaneros();
      
      if (cumpleaneros.length === 0) {
        return {
          success: true,
          clientesEncontrados: 0,
          mensajesEnviados: 0,
          errores: 0,
          detalles: [],
          mensaje: 'No hay clientes que cumplan años hoy'
        };
      }

      const resultados: Array<{
        clienteId: number;
        nombre: string;
        telefono: string;
        edad: number | null;
        enviado: boolean;
        error: string | null;
      }> = [];
      let mensajesEnviados = 0;
      let errores = 0;

      // Enviar mensaje a cada cliente cumpleañero
      for (const cliente of cumpleaneros) {
        const resultado = {
          clienteId: cliente.id,
          nombre: `${cliente.nombres} ${cliente.apellidos}`,
          telefono: cliente.telefono,
          edad: cliente.edad,
          enviado: false,
          error: null as string | null
        };

        try {
          // Verificar que tenga teléfono
          if (!cliente.telefono) {
            resultado.error = 'Cliente sin número de teléfono';
            errores++;
            resultados.push(resultado);
            continue;
          }

          // Enviar mensaje de cumpleaños
          const respuesta = await this.whatsappService.sendBirthdayMessage(
            cliente.telefono,
            cliente.nombres,
            cliente.edad || 0
          );

          if (respuesta.success) {
            resultado.enviado = true;
            mensajesEnviados++;
          } else {
            resultado.error = respuesta.error || 'Error desconocido';
            errores++;
          }

        } catch (error) {
          resultado.error = error.message || 'Error enviando mensaje';
          errores++;
        }

        resultados.push(resultado);
      }

      return {
        success: true,
        clientesEncontrados: cumpleaneros.length,
        mensajesEnviados,
        errores,
        detalles: resultados
      };

    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error procesando mensajes de cumpleaños',
        clientesEncontrados: 0,
        mensajesEnviados: 0,
        errores: 1,
        detalles: []
      };
    }
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
