import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import makeWASocket, { 
  ConnectionState, 
  DisconnectReason, 
  useMultiFileAuthState,
  WASocket,
  fetchLatestBaileysVersion,
  isJidBroadcast
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import { SendMessageDto } from './dto/send-message.dto';
import * as fs from 'fs';
import * as path from 'path';
import QRCode from 'qrcode-terminal';

@Injectable()
export class WhatsappService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(WhatsappService.name);
  private socket: WASocket;
  private isConnected = false;
  private isConnecting = false; // Prevenir reconexiones simultáneas
  private readonly authDir = './whatsapp-auth';
  private qrCode: string | null = null; // Almacenar QR para API
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  async onModuleInit() {
    try {
      await this.initializeWhatsApp();
    } catch (error) {
      this.logger.error('Error fatal inicializando WhatsApp:', error);
      // No lanzar error, dejar que la app continúe sin WhatsApp
    }
  }

  async onModuleDestroy() {
    this.cleanup();
  }

  private cleanup() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    if (this.socket) {
      try {
        this.socket.end(undefined);
      } catch (error) {
        this.logger.warn('Error al cerrar socket:', error.message);
      }
    }
  }

  private async initializeWhatsApp() {
    // Prevenir inicializaciones simultáneas
    if (this.isConnecting) {
      this.logger.warn('Ya hay una conexión en progreso, ignorando nueva solicitud');
      return;
    }

    this.isConnecting = true;

    try {
      // Crear directorio de autenticación si no existe
      if (!fs.existsSync(this.authDir)) {
        fs.mkdirSync(this.authDir, { recursive: true });
      }

      const { state, saveCreds } = await useMultiFileAuthState(this.authDir);
      
      // Obtener versión de Baileys
      const { version } = await fetchLatestBaileysVersion();

      this.socket = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false, // Desactivado - manejamos QR manualmente
        logger: this.createLogger(),
        browser: ['Francachela POS', 'Chrome', '120.0.6099.216'],
        qrTimeout: 60000, // QR válido por 60 segundos
        shouldSyncHistoryMessage: () => false, // Función requerida por tipo
        defaultQueryTimeoutMs: 10000,
        keepAliveIntervalMs: 30000,
      });

      // === EVENT: QR Code ===
      this.socket.ev.on('connection.update', async (update: Partial<ConnectionState>) => {
        const { connection, lastDisconnect, qr } = update;

        // Mostrar QR cuando está disponible
        if (qr) {
          this.logger.log('🔐 CÓDIGO QR DISPONIBLE - Escanea para conectar WhatsApp');
          this.logger.log('================================================');
          
          // Generar QR en terminal
          QRCode.generate(qr, { small: true }, (qrString) => {
            console.log('\n' + qrString + '\n');
          });
          
          // Almacenar para API
          this.qrCode = qr;
          this.logger.log('📱 También puedes obtener el QR desde: GET /whatsapp/qr');
          this.logger.log('================================================');
          
          // Reset de intentos en nuevo QR
          this.reconnectAttempts = 0;
        }

        // Conexión abierta
        if (connection === 'open') {
          this.isConnected = true;
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.qrCode = null; // Limpiar QR al conectar
          
          const phoneNumber = this.socket?.user?.id?.split(':')[0] || 'desconocido';
          this.logger.log(`✅ WhatsApp conectado exitosamente - Teléfono: ${phoneNumber}`);
        }

        // Conexión cerrada
        if (connection === 'close') {
          this.isConnected = false;
          const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

          this.logger.log(`❌ Conexión cerrada - Código: ${statusCode}`);

          if (shouldReconnect) {
            // Intentar reconexión si no alcanzamos máximo
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
              this.reconnectAttempts++;
              const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000); // Exponential backoff
              
              this.logger.log(`🔄 Reconectando en ${delay}ms (intento ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
              
              this.isConnecting = false;
              this.reconnectTimeout = setTimeout(() => this.initializeWhatsApp(), delay);
            } else {
              this.logger.error(`❌ Máximo de intentos de reconexión alcanzado (${this.maxReconnectAttempts})`);
              this.isConnecting = false;
            }
          } else {
            this.logger.log('📴 Sesión cerrada por logout');
            this.isConnecting = false;
            this.reconnectAttempts = 0;
          }
        }

        // Conectando
        if (connection === 'connecting') {
          this.logger.log('🔌 Conectando a WhatsApp...');
        }
      });

      // === EVENT: Credenciales actualizadas ===
      this.socket.ev.on('creds.update', saveCreds);

    } catch (error) {
      this.logger.error('❌ Error inicializando WhatsApp:', error?.message || error);
      this.isConnecting = false;
      
      // Reintentar después de un delay
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay = 5000 + (this.reconnectAttempts * 2000);
        this.logger.log(`🔄 Reintentando en ${delay}ms...`);
        this.reconnectTimeout = setTimeout(() => this.initializeWhatsApp(), delay);
      }
    }
  }

  private createLogger(): any {
    return {
      level: 'silent' as const,
      child: () => ({
        level: 'silent' as const,
        trace: () => { /* silent */ },
        debug: () => { /* silent */ },
        info: () => { /* silent */ },
        warn: () => { /* silent */ },
        error: () => { /* silent */ },
        fatal: () => { /* silent */ },
        child: () => ({ 
          level: 'silent' as const,
          trace: () => { /* silent */ },
          debug: () => { /* silent */ },
          info: () => { /* silent */ },
          warn: () => { /* silent */ },
          error: () => { /* silent */ },
          fatal: () => { /* silent */ }
        })
      }),
      trace: () => { /* silent */ },
      debug: () => { /* silent */ },
      info: () => { /* silent */ },
      warn: () => { /* silent */ },
      error: () => { /* silent */ },
      fatal: () => { /* silent */ }
    };
  }

  async sendMessage(sendMessageDto: SendMessageDto): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.isConnected) {
        return { success: false, error: 'WhatsApp no está conectado. Escanea el QR primero.' };
      }

      if (!this.socket) {
        return { success: false, error: 'Socket WhatsApp no inicializado' };
      }

      // Validar número
      if (!sendMessageDto.phone || sendMessageDto.phone.length < 10) {
        return { success: false, error: 'Número de teléfono inválido' };
      }

      // Formatear JID (Jabber ID)
      const jid = sendMessageDto.phone.includes('@') 
        ? sendMessageDto.phone 
        : `${sendMessageDto.phone}@s.whatsapp.net`;

      const sentMessage = await this.socket.sendMessage(jid, { 
        text: sendMessageDto.message 
      });

      this.logger.log(`✉️ Mensaje enviado a ${sendMessageDto.phone}`);
      
      return { 
        success: true, 
        messageId: sentMessage?.key?.id || undefined 
      };

    } catch (error) {
      this.logger.error(`❌ Error enviando mensaje: ${error?.message}`);
      return { 
        success: false, 
        error: error?.message || 'Error desconocido al enviar mensaje' 
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

  getConnectionStatus(): { connected: boolean; phone?: string; isConnecting?: boolean; qrAvailable?: boolean } {
    return {
      connected: this.isConnected,
      isConnecting: this.isConnecting,
      phone: this.socket?.user?.id?.split(':')[0],
      qrAvailable: !this.isConnected && !!this.qrCode
    };
  }

  async getQR(): Promise<{ success: boolean; qr?: string; message: string }> {
    if (this.isConnected) {
      return {
        success: false,
        message: 'WhatsApp ya está conectado'
      };
    }

    if (!this.qrCode) {
      return {
        success: false,
        message: 'Código QR no disponible. Intenta de nuevo en unos segundos o reinicia el servidor.'
      };
    }

    return {
      success: true,
      qr: this.qrCode,
      message: 'Escanea este QR con WhatsApp en tu teléfono'
    };
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      if (this.socket) {
        await this.socket.logout();
        this.isConnected = false;
        
        // Limpiar archivos de autenticación
        if (fs.existsSync(this.authDir)) {
          fs.rmSync(this.authDir, { recursive: true, force: true });
        }
        
        this.reconnectAttempts = 0;
        this.qrCode = null;
        this.cleanup();
        
        this.logger.log('✅ Sesión de WhatsApp cerrada');
        return { success: true, message: 'Sesión cerrada exitosamente' };
      }
      return { success: false, message: 'Socket no inicializado' };
    } catch (error) {
      this.logger.error('Error al cerrar sesión:', error);
      return { success: false, message: error?.message || 'Error desconocido' };
    }
  }

  async reconnect(): Promise<{ success: boolean; message: string }> {
    try {
      this.logger.log('🔄 Iniciando reconexión...');
      this.cleanup();
      this.reconnectAttempts = 0;
      this.isConnecting = false;
      await this.initializeWhatsApp();
      return { success: true, message: 'Reconexión iniciada' };
    } catch (error) {
      return { success: false, message: error?.message || 'Error al reconectar' };
    }
  }
}

