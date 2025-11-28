import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import makeWASocket, { 
  ConnectionState, 
  DisconnectReason, 
  useMultiFileAuthState,
  WASocket,
  proto
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { SendMessageDto } from './dto/send-message.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class WhatsappService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WhatsappService.name);
  private socket: WASocket;
  private isConnected = false;
  private readonly authDir = './whatsapp-auth';

  async onModuleInit() {
    await this.initializeWhatsApp();
  }

  async onModuleDestroy() {
    if (this.socket) {
      this.socket.end(undefined);
    }
  }

  private async initializeWhatsApp() {
    try {
      // Crear directorio de autenticación si no existe
      if (!fs.existsSync(this.authDir)) {
        fs.mkdirSync(this.authDir, { recursive: true });
      }

      const { state, saveCreds } = await useMultiFileAuthState(this.authDir);

      this.socket = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: {
          level: 'silent',
          child: () => ({ level: 'silent' } as any),
          trace: () => {},
          debug: () => {},
          info: () => {},
          warn: () => {},
          error: () => {},
          fatal: () => {}
        } as any,
      });

      this.socket.ev.on('connection.update', (update: Partial<ConnectionState>) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          this.logger.log('Escanea el código QR para conectar WhatsApp');
        }

        if (connection === 'close') {
          const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
          this.logger.log('Conexión cerrada debido a:', lastDisconnect?.error);
          
          if (shouldReconnect) {
            this.logger.log('Reconectando...');
            setTimeout(() => this.initializeWhatsApp(), 5000);
          }
          this.isConnected = false;
        } else if (connection === 'open') {
          this.logger.log('WhatsApp conectado exitosamente');
          this.isConnected = true;
        }
      });

      this.socket.ev.on('creds.update', saveCreds);

    } catch (error) {
      this.logger.error('Error inicializando WhatsApp:', error);
    }
  }

  async sendMessage(sendMessageDto: SendMessageDto): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.isConnected) {
        return { success: false, error: 'WhatsApp no está conectado' };
      }

      const jid = `${sendMessageDto.phone}@s.whatsapp.net`;
      
      const sentMessage = await this.socket.sendMessage(jid, { 
        text: sendMessageDto.message 
      });

      this.logger.log(`Mensaje enviado a ${sendMessageDto.phone}: ${sendMessageDto.message}`);
      
      return { 
        success: true, 
        messageId: sentMessage?.key?.id || undefined 
      };

    } catch (error) {
      this.logger.error('Error enviando mensaje:', error);
      return { 
        success: false, 
        error: error.message || 'Error desconocido' 
      };
    }
  }

  async sendVentaNotification(
    phone: string, 
    total: number, 
    puntosGanados: number, 
    ventaId: number
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const message = `🍻 ¡Gracias por tu compra en Francachela!

💰 Total: S/ ${total.toFixed(2)}
⭐ Puntos ganados: ${puntosGanados}
🎫 Ticket #${ventaId}

¡Vuelve pronto y sigue acumulando puntos! 🎉`;

    return this.sendMessage({ phone, message, ventaId });
  }

  async sendComboNotification(
    phone: string, 
    comboNombre: string, 
    ahorro: number, 
    total: number
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const message = `🎁 ¡Excelente elección!

🍻 Combo: ${comboNombre}
💰 Total: S/ ${total.toFixed(2)}
🎯 Ahorraste: S/ ${ahorro.toFixed(2)}

¡Gracias por elegir Francachela! 🍺`;

    return this.sendMessage({ phone, message });
  }

  async sendDeliveryNotification(
    phone: string, 
    direccion: string, 
    repartidor: string, 
    tiempoEstimado: string = '30-45 min'
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const message = `🚚 ¡Tu pedido está en camino!

📍 Dirección: ${direccion}
👤 Repartidor: ${repartidor}
⏰ Tiempo estimado: ${tiempoEstimado}

¡Prepárate para disfrutar! 🍻`;

    return this.sendMessage({ phone, message });
  }

  async sendLowStockAlert(
    adminPhone: string, 
    productos: Array<{ nombre: string; stock: number; minimo: number }>
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const productosTexto = productos
      .map(p => `• ${p.nombre}: ${p.stock} (mín: ${p.minimo})`)
      .join('\n');

    const message = `⚠️ ALERTA DE INVENTARIO

Los siguientes productos tienen stock bajo:

${productosTexto}

¡Revisa el inventario! 📦`;

    return this.sendMessage({ phone: adminPhone, message });
  }

  getConnectionStatus(): { connected: boolean; phone?: string } {
    return {
      connected: this.isConnected,
      phone: this.socket?.user?.id?.split(':')[0]
    };
  }

  async generateQR(): Promise<string> {
    // En una implementación real, podrías generar un QR base64
    // Por ahora retornamos un mensaje
    return 'Revisa la consola para el código QR';
  }

  async logout(): Promise<{ success: boolean }> {
    try {
      if (this.socket) {
        await this.socket.logout();
        this.isConnected = false;
        
        // Limpiar archivos de autenticación
        if (fs.existsSync(this.authDir)) {
          fs.rmSync(this.authDir, { recursive: true, force: true });
        }
        
        return { success: true };
      }
      return { success: false };
    } catch (error) {
      this.logger.error('Error al cerrar sesión:', error);
      return { success: false };
    }
  }
}
