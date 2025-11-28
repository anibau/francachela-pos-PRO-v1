"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var WhatsappService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappService = void 0;
const common_1 = require("@nestjs/common");
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const fs = __importStar(require("fs"));
let WhatsappService = WhatsappService_1 = class WhatsappService {
    logger = new common_1.Logger(WhatsappService_1.name);
    socket;
    isConnected = false;
    authDir = './whatsapp-auth';
    async onModuleInit() {
        await this.initializeWhatsApp();
    }
    async onModuleDestroy() {
        if (this.socket) {
            this.socket.end(undefined);
        }
    }
    async initializeWhatsApp() {
        try {
            if (!fs.existsSync(this.authDir)) {
                fs.mkdirSync(this.authDir, { recursive: true });
            }
            const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)(this.authDir);
            this.socket = (0, baileys_1.default)({
                auth: state,
                printQRInTerminal: true,
                logger: {
                    level: 'silent',
                    child: () => ({ level: 'silent' }),
                    trace: () => { },
                    debug: () => { },
                    info: () => { },
                    warn: () => { },
                    error: () => { },
                    fatal: () => { }
                },
            });
            this.socket.ev.on('connection.update', (update) => {
                const { connection, lastDisconnect, qr } = update;
                if (qr) {
                    this.logger.log('Escanea el código QR para conectar WhatsApp');
                }
                if (connection === 'close') {
                    const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== baileys_1.DisconnectReason.loggedOut;
                    this.logger.log('Conexión cerrada debido a:', lastDisconnect?.error);
                    if (shouldReconnect) {
                        this.logger.log('Reconectando...');
                        setTimeout(() => this.initializeWhatsApp(), 5000);
                    }
                    this.isConnected = false;
                }
                else if (connection === 'open') {
                    this.logger.log('WhatsApp conectado exitosamente');
                    this.isConnected = true;
                }
            });
            this.socket.ev.on('creds.update', saveCreds);
        }
        catch (error) {
            this.logger.error('Error inicializando WhatsApp:', error);
        }
    }
    async sendMessage(sendMessageDto) {
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
                messageId: sentMessage?.key?.id
            };
        }
        catch (error) {
            this.logger.error('Error enviando mensaje:', error);
            return {
                success: false,
                error: error.message || 'Error desconocido'
            };
        }
    }
    async sendVentaNotification(phone, total, puntosGanados, ventaId) {
        const message = `🍻 ¡Gracias por tu compra en Francachela!

💰 Total: S/ ${total.toFixed(2)}
⭐ Puntos ganados: ${puntosGanados}
🎫 Ticket #${ventaId}

¡Vuelve pronto y sigue acumulando puntos! 🎉`;
        return this.sendMessage({ phone, message, ventaId });
    }
    async sendComboNotification(phone, comboNombre, ahorro, total) {
        const message = `🎁 ¡Excelente elección!

🍻 Combo: ${comboNombre}
💰 Total: S/ ${total.toFixed(2)}
🎯 Ahorraste: S/ ${ahorro.toFixed(2)}

¡Gracias por elegir Francachela! 🍺`;
        return this.sendMessage({ phone, message });
    }
    async sendDeliveryNotification(phone, direccion, repartidor, tiempoEstimado = '30-45 min') {
        const message = `🚚 ¡Tu pedido está en camino!

📍 Dirección: ${direccion}
👤 Repartidor: ${repartidor}
⏰ Tiempo estimado: ${tiempoEstimado}

¡Prepárate para disfrutar! 🍻`;
        return this.sendMessage({ phone, message });
    }
    async sendLowStockAlert(adminPhone, productos) {
        const productosTexto = productos
            .map(p => `• ${p.nombre}: ${p.stock} (mín: ${p.minimo})`)
            .join('\n');
        const message = `⚠️ ALERTA DE INVENTARIO

Los siguientes productos tienen stock bajo:

${productosTexto}

¡Revisa el inventario! 📦`;
        return this.sendMessage({ phone: adminPhone, message });
    }
    getConnectionStatus() {
        return {
            connected: this.isConnected,
            phone: this.socket?.user?.id?.split(':')[0]
        };
    }
    async generateQR() {
        return 'Revisa la consola para el código QR';
    }
    async logout() {
        try {
            if (this.socket) {
                await this.socket.logout();
                this.isConnected = false;
                if (fs.existsSync(this.authDir)) {
                    fs.rmSync(this.authDir, { recursive: true, force: true });
                }
                return { success: true };
            }
            return { success: false };
        }
        catch (error) {
            this.logger.error('Error al cerrar sesión:', error);
            return { success: false };
        }
    }
};
exports.WhatsappService = WhatsappService;
exports.WhatsappService = WhatsappService = WhatsappService_1 = __decorate([
    (0, common_1.Injectable)()
], WhatsappService);
//# sourceMappingURL=whatsapp.service.js.map