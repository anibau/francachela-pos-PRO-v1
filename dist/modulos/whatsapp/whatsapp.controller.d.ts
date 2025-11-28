import { WhatsappService } from './whatsapp.service';
import { SendMessageDto } from './dto/send-message.dto';
export declare class WhatsappController {
    private readonly whatsappService;
    constructor(whatsappService: WhatsappService);
    sendMessage(sendMessageDto: SendMessageDto): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendVentaNotification(body: {
        phone: string;
        total: number;
        puntosGanados: number;
        ventaId: number;
    }): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendComboNotification(body: {
        phone: string;
        comboNombre: string;
        ahorro: number;
        total: number;
    }): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendDeliveryNotification(body: {
        phone: string;
        direccion: string;
        repartidor: string;
        tiempoEstimado?: string;
    }): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendLowStockAlert(body: {
        adminPhone: string;
        productos: Array<{
            nombre: string;
            stock: number;
            minimo: number;
        }>;
    }): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    getStatus(): {
        connected: boolean;
        phone?: string;
    };
    generateQR(): Promise<string>;
    logout(): Promise<{
        success: boolean;
    }>;
}
