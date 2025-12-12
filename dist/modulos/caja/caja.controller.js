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
exports.CajaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const caja_service_1 = require("./caja.service");
const abrir_caja_dto_1 = require("./dto/abrir-caja.dto");
const cerrar_caja_dto_1 = require("./dto/cerrar-caja.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const usuario_entity_1 = require("../../entities/usuario.entity");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let CajaController = class CajaController {
    cajaService;
    constructor(cajaService) {
        this.cajaService = cajaService;
    }
    abrirCaja(abrirCajaDto, user) {
        return this.cajaService.abrirCaja(abrirCajaDto, user.username);
    }
    cerrarCaja(id, cerrarCajaDto) {
        return this.cajaService.cerrarCaja(id, cerrarCajaDto);
    }
    findAll(paginationDto) {
        return this.cajaService.findAll(paginationDto);
    }
    getCajaActual(user) {
        return this.cajaService.getCajaActual(user.username);
    }
    getResumenCajaActual(user) {
        return this.cajaService.getResumenCajaActual(user.username);
    }
    getEstadisticas(fechaInicio, fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        return this.cajaService.getEstadisticasCajas(inicio, fin);
    }
    getCajasPorFecha(fechaInicio, fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        return this.cajaService.getCajasPorFecha(inicio, fin);
    }
    findOne(id) {
        return this.cajaService.findById(id);
    }
};
exports.CajaController = CajaController;
__decorate([
    (0, common_1.Post)('abrir'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Abrir caja registradora' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Caja abierta exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Ya existe una caja abierta' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [abrir_caja_dto_1.AbrirCajaDto, usuario_entity_1.Usuario]),
    __metadata("design:returntype", void 0)
], CajaController.prototype, "abrirCaja", null);
__decorate([
    (0, common_1.Patch)(':id/cerrar'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Cerrar caja registradora' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Caja cerrada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'La caja ya está cerrada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Caja no encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, cerrar_caja_dto_1.CerrarCajaDto]),
    __metadata("design:returntype", void 0)
], CajaController.prototype, "cerrarCaja", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener historial de cajas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Historial de cajas obtenido exitosamente' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], CajaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('actual'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener caja actual del cajero' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Caja actual obtenida exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No hay caja abierta' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [usuario_entity_1.Usuario]),
    __metadata("design:returntype", void 0)
], CajaController.prototype, "getCajaActual", null);
__decorate([
    (0, common_1.Get)('resumen'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener resumen de la caja actual' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Resumen de caja obtenido exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No hay caja abierta' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [usuario_entity_1.Usuario]),
    __metadata("design:returntype", void 0)
], CajaController.prototype, "getResumenCajaActual", null);
__decorate([
    (0, common_1.Get)('estadisticas'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener estadísticas de cajas por rango de fechas' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estadísticas obtenidas exitosamente' }),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CajaController.prototype, "getEstadisticas", null);
__decorate([
    (0, common_1.Get)('rango'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener cajas por rango de fechas' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cajas del rango obtenidas exitosamente' }),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CajaController.prototype, "getCajasPorFecha", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener caja por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Caja encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Caja no encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CajaController.prototype, "findOne", null);
exports.CajaController = CajaController = __decorate([
    (0, swagger_1.ApiTags)('Caja'),
    (0, common_1.Controller)('caja'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [caja_service_1.CajaService])
], CajaController);
//# sourceMappingURL=caja.controller.js.map