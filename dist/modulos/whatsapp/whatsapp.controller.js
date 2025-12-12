"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const whatsapp_service_1 = require("./whatsapp.service");
const send_message_dto_1 = require("./dto/send-message.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const usuario_entity_1 = require("../../entities/usuario.entity");
let WhatsappController = class WhatsappController {
    whatsappService;
    constructor(whatsappService) {
        this.whatsappService = whatsappService;
    }
    sendMessage(sendMessageDto) {
        return this.whatsappService.sendMessage(sendMessageDto);
    }
    sendVentaNotification(body) {
        return this.whatsappService.sendVentaNotification(body.phone, body.total, body.puntosGanados, body.ventaId);
    }
    sendComboNotification(body) {
        return this.whatsappService.sendComboNotification(body.phone, body.comboNombre, body.ahorro, body.total);
    }
    sendDeliveryNotification(body) {
        return this.whatsappService.sendDeliveryNotification(body.phone, body.direccion, body.repartidor, body.tiempoEstimado);
    }
    sendLowStockAlert(body) {
        return this.whatsappService.sendLowStockAlert(body.adminPhone, body.productos);
    }
    sendWelcomeMessage(body) {
        return this.whatsappService.sendWelcomeMessage(body.phone, body.nombres, body.apellidos, body.codigoCorto);
    }
    getStatus() {
        return this.whatsappService.getConnectionStatus();
    }
    generateQR() {
        return this.whatsappService.generateQR();
    }
    logout() {
        return this.whatsappService.logout();
    }
};
exports.WhatsappController = WhatsappController;
__decorate([
    (0, common_1.Post)('send'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Enviar mensaje de WhatsApp' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Mensaje enviado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Error enviando mensaje' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Post)('send-venta'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Enviar notificación de venta' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Notificación enviada exitosamente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "sendVentaNotification", null);
__decorate([
    (0, common_1.Post)('send-combo'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Enviar notificación de combo' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Notificación de combo enviada' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "sendComboNotification", null);
__decorate([
    (0, common_1.Post)('send-delivery'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Enviar notificación de delivery' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Notificación de delivery enviada' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "sendDeliveryNotification", null);
__decorate([
    (0, common_1.Post)('send-stock-alert'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.INVENTARIOS),
    (0, swagger_1.ApiOperation)({ summary: 'Enviar alerta de stock bajo' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Alerta enviada exitosamente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "sendLowStockAlert", null);
__decorate([
    (0, common_1.Post)('send-welcome'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Enviar mensaje de bienvenida a nuevo cliente' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Mensaje de bienvenida enviado exitosamente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "sendWelcomeMessage", null);
__decorate([
    (0, common_1.Get)('status'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener estado de conexión de WhatsApp' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estado obtenido exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Get)('qr'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Generar código QR para conexión' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QR generado exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "generateQR", null);
__decorate([
    (0, common_1.Delete)('logout'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Cerrar sesión de WhatsApp' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Sesión cerrada exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], WhatsappController.prototype, "logout", null);
exports.WhatsappController = WhatsappController = __decorate([
    (0, swagger_1.ApiTags)('WhatsApp'),
    (0, common_1.Controller)('whatsapp'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [whatsapp_service_1.WhatsappService])
], WhatsappController);
//# sourceMappingURL=whatsapp.controller.js.map