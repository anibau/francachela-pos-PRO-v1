import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { SendMessageDto } from './dto/send-message.dto';
export declare class WhatsappService implements OnModuleInit, OnModuleDestroy {
    private readonly logger;
    private socket;
    private isConnected;
    private readonly authDir;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private initializeWhatsApp;
    sendMessage(sendMessageDto: SendMessageDto): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendVentaNotification(phone: string, total: number, puntosGanados: number, ventaId: number): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendComboNotification(phone: string, comboNombre: string, ahorro: number, total: number): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendDeliveryNotification(phone: string, direccion: string, repartidor: string, tiempoEstimado?: string): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendLowStockAlert(adminPhone: string, productos: Array<{
        nombre: string;
        stock: number;
        minimo: number;
    }>): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendWelcomeMessage(phone: string, nombres: string, apellidos: string, codigoCorto: string): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    sendClientInfoMessage(phone: string, nombres: string, apellidos: string, codigoCorto: string, puntosAcumulados: number): Promise<{
        success: boolean;
        messageId?: string;
        error?: string;
    }>;
    getConnectionStatus(): {
        connected: boolean;
        phone?: string;
    };
    generateQR(): Promise<string>;
    logout(): Promise<{
        success: boolean;
    }>;
    private validateSessionIntegrity;
    private clearSession;
}
