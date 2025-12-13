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
    try {
      // Limpiar timeout de reconexión
      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
      
      // Cerrar socket de manera segura
      if (this.socket) {
        try {
          // Intentar cerrar la conexión gracefully
          this.socket.end(undefined);
          
          this.logger.log('Socket cerrado correctamente');
        } catch (error) {
          this.logger.warn('Error al cerrar socket:', error?.message || error);
        }
      }

      this.isConnected = false;
      this.isConnecting = false;
    } catch (error) {
      this.logger.error('Error en cleanup:', error);
    }
  }

  private async initializeWhatsApp() {
    // Prevenir inicializaciones simultáneas
    if (this.isConnecting) {
      this.logger.warn('Ya hay una conexión en progreso, ignorando nueva solicitud');
      return;
    }

    this.isConnecting = true;
    this.isConnected = false; // Resetear flag de conexión

    try {
      // Validar integridad de la sesión antes de inicializar
      const isSessionValid = await this.validateSessionIntegrity();
      
      if (!isSessionValid) {
        this.logger.log('Sesión corrupta detectada, iniciando con sesión limpia...');
      }

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
        qrTimeout: 90000, // QR válido por 90 segundos (aumentado para mejor UX)
        shouldSyncHistoryMessage: () => false, // Función requerida por tipo
        defaultQueryTimeoutMs: 15000, // Aumentado de 10s
        keepAliveIntervalMs: 20000, // Reducido de 30s para mantener conexión activa
        retryRequestDelayMs: 100, // Intentar más rápido los reintentos
      });

      // === EVENT: CONNECTION UPDATE - Cambios de estado de conexión ===
      this.socket.ev.on('connection.update', async (update: Partial<ConnectionState>) => {
        const { connection, lastDisconnect, qr } = update;

        // ✅ NUEVO - Detectar conexión exitosa
        if (connection === 'open') {
          this.isConnected = true;
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.logger.log('✅ Conexión exitosa con WhatsApp - LISTO PARA ENVIAR MENSAJES');
          this.logger.log('📱 Teléfono conectado:', this.socket?.user?.id?.split(':')[0] || 'Desconocido');
          return;
        }

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

        if (connection === 'close') {
          const boom = lastDisconnect?.error as Boom;
          const statusCode = boom?.output?.statusCode;
          const errorMessage = (lastDisconnect?.error as any)?.message?.toLowerCase() || '';
          const errorData = (lastDisconnect?.error as any)?.data;
          
          this.logger.warn(`⚠️ Conexión cerrada - Status: ${statusCode}, Mensaje: ${lastDisconnect?.error?.message || 'Desconocido'}`);
          
          // Manejo específico de errores
          if (errorMessage.includes('bad mac') || errorMessage.includes('mac')) {
            this.logger.warn('❌ Error Bad MAC detectado - limpiando sesión corrupta');
            this.clearSession();
            this.isConnecting = false;
            this.reconnectAttempts = 0;
            setTimeout(() => this.initializeWhatsApp(), 3000);
            return;
          }

          // Código 515 - Stream Error (requiere reconexión)
          if (statusCode === 515 || errorData?.tag === 'stream:error') {
            this.logger.warn(`🔄 Stream Errored (515) - Intentando reconectar...`);
            
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
              this.reconnectAttempts++;
              const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000);
              
              this.logger.log(`🔄 Reconectando en ${delay}ms (intento ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
              
              this.isConnecting = false;
              this.reconnectTimeout = setTimeout(() => this.initializeWhatsApp(), delay);
            } else {
              this.logger.error(`❌ Máximo de intentos de reconexión alcanzado para error 515 (${this.maxReconnectAttempts})`);
              this.isConnecting = false;
            }
            return;
          }

          // Logout intencional
          if (statusCode === DisconnectReason.loggedOut) {
            this.logger.log('📴 Sesión cerrada por logout intencional');
            this.isConnecting = false;
            this.isConnected = false;
            this.reconnectAttempts = 0;
            return;
          }

          // Otros errores - Intentar reconectar
          const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
          
          if (shouldReconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000);
            
            this.logger.log(`🔄 Reconectando en ${delay}ms (intento ${this.reconnectAttempts}/${this.maxReconnectAttempts}) - Status: ${statusCode}`);
            
            this.isConnecting = false;
            this.reconnectTimeout = setTimeout(() => this.initializeWhatsApp(), delay);
          } else if (!shouldReconnect) {
            this.logger.log('📴 No reintentar - sesión cerrada por logout');
            this.isConnecting = false;
            this.isConnected = false;
            this.reconnectAttempts = 0;
          } else {
            this.logger.error(`❌ Máximo de intentos de reconexión alcanzado (${this.maxReconnectAttempts})`);
            this.isConnecting = false;
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
      const errorMessage = error.message?.toLowerCase() || '';
      
      if (errorMessage.includes('bad mac')) {
        this.logger.error('Error Bad MAC en inicialización - limpiando sesión');
        this.clearSession();
        this.isConnecting = false;
        setTimeout(() => this.initializeWhatsApp(), 3000);
      } else {
        this.logger.error('Error inicializando WhatsApp:', error.message || error);
        this.isConnecting = false;
        // Reintentar con backoff
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts - 1), 30000);
          this.logger.log(`🔄 Reintentar inicialización en ${delay}ms`);
          setTimeout(() => this.initializeWhatsApp(), delay);
        }
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
        this.logger.warn('Intento de envío sin conexión. Estado: isConnected=' + this.isConnected);
        return { success: false, error: 'WhatsApp no está conectado. Escanea el QR primero.' };
      }

      if (!this.socket) {
        this.logger.error('Socket es null pero isConnected=true');
        this.isConnected = false;
        return { success: false, error: 'Socket WhatsApp no inicializado' };
      }

      // Validar número
      if (!sendMessageDto.phone || sendMessageDto.phone.length < 10) {
        return { success: false, error: 'Número de teléfono inválido' };
      }

      if (!sendMessageDto.message || sendMessageDto.message.trim().length === 0) {
        return { success: false, error: 'El mensaje no puede estar vacío' };
      }

      // Formatear JID (Jabber ID)
      const jid = sendMessageDto.phone.includes('@') 
        ? sendMessageDto.phone 
        : `${sendMessageDto.phone}@s.whatsapp.net`;

      try {
        const sentMessage = await this.socket.sendMessage(jid, { 
          text: sendMessageDto.message 
        });

        this.logger.log(`✉️ Mensaje enviado exitosamente a ${sendMessageDto.phone}`);
        
        return { 
          success: true, 
          messageId: sentMessage?.key?.id || undefined 
        };
      } catch (sendError) {
        const errorMsg = sendError?.message || 'Error desconocido al enviar';
        
        // Si hay error de conexión al enviar, marcar como desconectado
        if (errorMsg.includes('stream') || errorMsg.includes('socket') || errorMsg.includes('connection')) {
          this.logger.error('❌ Error de conexión detectado durante envío:', errorMsg);
          this.isConnected = false;
        }

        this.logger.error(`❌ Error enviando mensaje a ${sendMessageDto.phone}: ${errorMsg}`);
        return { 
          success: false, 
          error: errorMsg 
        };
      }

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
    ticketId: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const message = `🍻 ¡Gracias por tu compra en Francachela!

💰 Total: S/ ${total.toFixed(2)}
⭐ Puntos ganados: ${puntosGanados}
🎫 Ticket #${ticketId}

🌐 Visita nuestra web: https://francachela-licores.github.io/francachela/

¡Vuelve pronto y sigue acumulando puntos! 🎉`;

    return this.sendMessage({ phone, message });
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

  async sendWelcomeMessage(
    phone: string,
    nombres: string,
    apellidos: string,
    codigoCorto: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const message = `🎉 ¡Bienvenido/a a Francachela, ${nombres} ${apellidos}!

🆔 Tu código de cliente: ${codigoCorto}
⭐ Empieza a acumular puntos con cada compra
🎁 Canjea tus puntos por descuentos especiales

🌐 Conoce más en: https://francachela-licores.github.io/francachela/

¡Gracias por elegirnos! 🍻`;

    return this.sendMessage({ phone, message });
  }

  async sendClientInfoMessage(
    phone: string,
    nombres: string,
    apellidos: string,
    codigoCorto: string,
    puntosAcumulados: number
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const message = `📱 Información de tu cuenta Francachela

👤 Cliente: ${nombres} ${apellidos}
🆔 Código: ${codigoCorto}
⭐ Puntos disponibles: ${puntosAcumulados}

🎁 Usa tus puntos para obtener descuentos
🌐 Visita: https://francachela-licores.github.io/francachela/

¡Gracias por ser cliente! 🍻`;

    return this.sendMessage({ phone, message });
  }

  getConnectionStatus(): { 
    connected: boolean; 
    phone?: string; 
    isConnecting: boolean; 
    qrAvailable: boolean;
    reconnectAttempts: number;
    socketHealth: string;
  } {
    let socketHealth = '🟢 OK';
    
    if (!this.isConnected && !this.isConnecting) {
      socketHealth = '🔴 DESCONECTADO';
    } else if (this.isConnecting) {
      socketHealth = '🟡 CONECTANDO';
    } else if (this.reconnectAttempts > 0) {
      socketHealth = '🟠 RECUPERÁNDOSE';
    }

    return {
      connected: this.isConnected,
      isConnecting: this.isConnecting,
      phone: this.socket?.user?.id?.split(':')[0],
      qrAvailable: !this.isConnected && !!this.qrCode,
      reconnectAttempts: this.reconnectAttempts,
      socketHealth
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
      this.logger.log('🔐 Iniciando logout de WhatsApp...');
      
      if (this.socket) {
        try {
          await this.socket.logout();
        } catch (error) {
          this.logger.warn('Error durante logout de socket:', error?.message);
        }
      }
      
      // Limpiar recursos
      this.cleanup();
      
      // Limpiar credenciales y sesión
      if (fs.existsSync(this.authDir)) {
        fs.rmSync(this.authDir, { recursive: true, force: true });
        this.logger.log('Credenciales eliminadas');
      }
      
      this.reconnectAttempts = 0;
      this.qrCode = null;
      this.isConnected = false;
      this.isConnecting = false;
      
      this.logger.log('✅ Sesión de WhatsApp cerrada completamente');
      return { success: true, message: 'Sesión cerrada exitosamente' };
    } catch (error) {
      this.logger.error('Error al cerrar sesión:', error?.message);
      return { success: false, message: error?.message || 'Error desconocido al cerrar sesión' };
    }
  }

  async reconnect(): Promise<{ success: boolean; message: string }> {
    try {
      this.logger.log('🔄 Iniciando reconexión manual...');
      this.cleanup();
      this.reconnectAttempts = 0;
      this.isConnecting = false;
      this.isConnected = false;
      this.qrCode = null; // Resetear QR para nueva sesión
      
      // Dar tiempo para que los recursos se liberen
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await this.initializeWhatsApp();
      return { success: true, message: 'Reconexión iniciada' };
    } catch (error) {
      this.logger.error('Error al reconectar:', error?.message);
      return { success: false, message: error?.message || 'Error al reconectar' };
    }
  }

  private async validateSessionIntegrity(): Promise<boolean> {
    try {
      // Verificar si el directorio de autenticación existe
      if (!fs.existsSync(this.authDir)) {
        return true; // Nueva sesión, válida
      }

      const files = fs.readdirSync(this.authDir);
      if (files.length === 0) {
        return true; // Sesión vacía, válida
      }

      // Intentar leer y validar creds.json
      const credsPath = path.join(this.authDir, 'creds.json');
      if (fs.existsSync(credsPath)) {
        const creds = JSON.parse(fs.readFileSync(credsPath, 'utf-8'));
        
        // Verificar campos necesarios de credenciales
        if (!creds.signedIdentityKey || !creds.signedPreKey) {
          this.logger.warn('Credenciales incompletas detectadas');
          fs.rmSync(this.authDir, { recursive: true, force: true });
          return false;
        }
      }

      return true;
    } catch (error) {
      this.logger.error('Error validando integridad de sesión:', error);
      // En caso de error, asumir sesión corrupta y limpiar
      this.clearSession();
      return false;
    }
  }

  private clearSession(): void {
    try {
      if (fs.existsSync(this.authDir)) {
        fs.rmSync(this.authDir, { recursive: true, force: true });
        this.logger.log('Sesión de WhatsApp limpiada exitosamente');
      }
    } catch (error) {
      this.logger.error('Error limpiando sesión:', error);
    }
  }
}

