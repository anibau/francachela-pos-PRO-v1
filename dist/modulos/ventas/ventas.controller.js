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
exports.VentasController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ventas_service_1 = require("./ventas.service");
const create_venta_dto_1 = require("./dto/create-venta.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const usuario_entity_1 = require("../../entities/usuario.entity");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let VentasController = class VentasController {
    ventasService;
    constructor(ventasService) {
        this.ventasService = ventasService;
    }
    create(createVentaDto, user) {
        return this.ventasService.create(createVentaDto, user.username);
    }
    findAll(paginationDto) {
        return this.ventasService.findAll(paginationDto);
    }
    getVentasDelDia() {
        return this.ventasService.getVentasDelDia();
    }
    getEstadisticas(fechaInicio, fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        return this.ventasService.getEstadisticasVentas(inicio, fin);
    }
    findByDateRange(fechaInicio, fechaFin, paginationDto) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        return this.ventasService.findByDateRange(inicio, fin, paginationDto);
    }
    findByCliente(clienteId, paginationDto) {
        return this.ventasService.findByCliente(clienteId, paginationDto);
    }
    findByTicketId(ticketId) {
        return this.ventasService.findByTicketId(ticketId);
    }
    findOne(id) {
        return this.ventasService.findById(id);
    }
    anularVenta(id, user) {
        return this.ventasService.anularVenta(id, user.username);
    }
};
exports.VentasController = VentasController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nueva venta' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Venta creada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos de venta inválidos' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_venta_dto_1.CreateVentaDto, usuario_entity_1.Usuario]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las ventas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de ventas obtenida exitosamente' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('hoy'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener ventas del día actual' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ventas del día obtenidas exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "getVentasDelDia", null);
__decorate([
    (0, common_1.Get)('estadisticas'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener estadísticas de ventas por rango de fechas' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estadísticas obtenidas exitosamente' }),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "getEstadisticas", null);
__decorate([
    (0, common_1.Get)('rango'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener ventas por rango de fechas' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ventas del rango obtenidas exitosamente' }),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "findByDateRange", null);
__decorate([
    (0, common_1.Get)('cliente/:clienteId'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener ventas de un cliente específico' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ventas del cliente obtenidas exitosamente' }),
    __param(0, (0, common_1.Param)('clienteId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "findByCliente", null);
__decorate([
    (0, common_1.Get)('ticket/:ticketId'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener venta por ticket ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Venta encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Venta no encontrada' }),
    __param(0, (0, common_1.Param)('ticketId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "findByTicketId", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener venta por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Venta encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Venta no encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/anular'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Anular venta' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Venta anulada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'La venta ya está anulada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Venta no encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, usuario_entity_1.Usuario]),
    __metadata("design:returntype", void 0)
], VentasController.prototype, "anularVenta", null);
exports.VentasController = VentasController = __decorate([
    (0, swagger_1.ApiTags)('Ventas'),
    (0, common_1.Controller)('ventas'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [ventas_service_1.VentasService])
], VentasController);
//# sourceMappingURL=ventas.controller.js.map