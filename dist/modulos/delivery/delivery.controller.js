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
exports.DeliveryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const delivery_service_1 = require("./delivery.service");
const create_delivery_dto_1 = require("./dto/create-delivery.dto");
const update_delivery_dto_1 = require("./dto/update-delivery.dto");
const jwt_auth_guard_1 = require("../../../src/modulos/auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const enums_1 = require("../../common/enums");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let DeliveryController = class DeliveryController {
    deliveryService;
    constructor(deliveryService) {
        this.deliveryService = deliveryService;
    }
    create(createDeliveryDto) {
        return this.deliveryService.create(createDeliveryDto);
    }
    findAll(paginationDto) {
        return this.deliveryService.findAll(paginationDto);
    }
    getDeliveriesDelDia() {
        return this.deliveryService.getDeliveriesDelDia();
    }
    getRepartidores() {
        return this.deliveryService.getRepartidores();
    }
    getEstadisticas(fechaInicio, fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        return this.deliveryService.getEstadisticasDelivery(inicio, fin);
    }
    findByEstado(estado, paginationDto) {
        return this.deliveryService.findByEstado(estado, paginationDto);
    }
    findByRepartidor(repartidor, paginationDto) {
        return this.deliveryService.findByRepartidor(repartidor, paginationDto);
    }
    findByDateRange(fechaInicio, fechaFin, paginationDto) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        return this.deliveryService.findByDateRange(inicio, fin, paginationDto);
    }
    findOne(id) {
        return this.deliveryService.findById(id);
    }
    update(id, updateDeliveryDto) {
        return this.deliveryService.update(id, updateDeliveryDto);
    }
    asignarRepartidor(id, repartidor) {
        return this.deliveryService.asignarRepartidor(id, repartidor);
    }
    marcarEnCamino(id, horaSalida) {
        return this.deliveryService.marcarEnCamino(id, horaSalida);
    }
    marcarEntregado(id, horaEntrega) {
        return this.deliveryService.marcarEntregado(id, horaEntrega);
    }
    cancelar(id) {
        return this.deliveryService.cancelar(id);
    }
};
exports.DeliveryController = DeliveryController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nuevo delivery' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Delivery creado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_delivery_dto_1.CreateDeliveryDto]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los deliveries' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de deliveries obtenida exitosamente' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('hoy'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener deliveries del día actual' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deliveries del día obtenidos exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "getDeliveriesDelDia", null);
__decorate([
    (0, common_1.Get)('repartidores'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener lista de repartidores' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Repartidores obtenidos exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "getRepartidores", null);
__decorate([
    (0, common_1.Get)('estadisticas'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener estadísticas de delivery por rango de fechas' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estadísticas obtenidas exitosamente' }),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "getEstadisticas", null);
__decorate([
    (0, common_1.Get)('estado/:estado'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener deliveries por estado' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deliveries por estado obtenidos exitosamente' }),
    __param(0, (0, common_1.Param)('estado')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "findByEstado", null);
__decorate([
    (0, common_1.Get)('repartidor/:repartidor'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener deliveries por repartidor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deliveries del repartidor obtenidos exitosamente' }),
    __param(0, (0, common_1.Param)('repartidor')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "findByRepartidor", null);
__decorate([
    (0, common_1.Get)('rango'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener deliveries por rango de fechas' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Deliveries del rango obtenidos exitosamente' }),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "findByDateRange", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener delivery por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Delivery encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Delivery no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar delivery' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Delivery actualizado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Delivery no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_delivery_dto_1.UpdateDeliveryDto]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/asignar'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Asignar repartidor a delivery' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Repartidor asignado exitosamente' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('repartidor')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "asignarRepartidor", null);
__decorate([
    (0, common_1.Patch)(':id/en-camino'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar delivery en camino' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Delivery marcado en camino' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('horaSalida')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "marcarEnCamino", null);
__decorate([
    (0, common_1.Patch)(':id/entregado'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Marcar delivery como entregado' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Delivery marcado como entregado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('horaEntrega')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "marcarEntregado", null);
__decorate([
    (0, common_1.Patch)(':id/cancelar'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Cancelar delivery' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Delivery cancelado exitosamente' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], DeliveryController.prototype, "cancelar", null);
exports.DeliveryController = DeliveryController = __decorate([
    (0, swagger_1.ApiTags)('Delivery'),
    (0, common_1.Controller)('delivery'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [delivery_service_1.DeliveryService])
], DeliveryController);
//# sourceMappingURL=delivery.controller.js.map