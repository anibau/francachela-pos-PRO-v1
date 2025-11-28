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
exports.PromocionesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const promociones_service_1 = require("./promociones.service");
const create_promocion_dto_1 = require("./dto/create-promocion.dto");
const update_promocion_dto_1 = require("./dto/update-promocion.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const usuario_entity_1 = require("../../entities/usuario.entity");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const promocion_entity_1 = require("../../entities/promocion.entity");
let PromocionesController = class PromocionesController {
    promocionesService;
    constructor(promocionesService) {
        this.promocionesService = promocionesService;
    }
    create(createPromocionDto) {
        return this.promocionesService.create(createPromocionDto);
    }
    findAll(paginationDto) {
        return this.promocionesService.findAll(paginationDto);
    }
    findActivas() {
        return this.promocionesService.findActivas();
    }
    getVencidas() {
        return this.promocionesService.getPromocionesVencidas();
    }
    findByTipo(tipo) {
        return this.promocionesService.findByTipo(tipo);
    }
    findOne(id) {
        return this.promocionesService.findById(id);
    }
    update(id, updatePromocionDto) {
        return this.promocionesService.update(id, updatePromocionDto);
    }
    remove(id) {
        return this.promocionesService.remove(id);
    }
    activate(id) {
        return this.promocionesService.activate(id);
    }
    desactivarVencidas() {
        return this.promocionesService.desactivarVencidas();
    }
};
exports.PromocionesController = PromocionesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nueva promoción' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Promoción creada exitosamente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_promocion_dto_1.CreatePromocionDto]),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las promociones' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de promociones obtenida exitosamente' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('activas'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener promociones activas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Promociones activas obtenidas exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "findActivas", null);
__decorate([
    (0, common_1.Get)('vencidas'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener promociones vencidas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Promociones vencidas obtenidas exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "getVencidas", null);
__decorate([
    (0, common_1.Get)('tipo/:tipo'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener promociones por tipo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Promociones por tipo obtenidas exitosamente' }),
    __param(0, (0, common_1.Param)('tipo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "findByTipo", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener promoción por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Promoción encontrada' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Promoción no encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar promoción' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Promoción actualizada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Promoción no encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_promocion_dto_1.UpdatePromocionDto]),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Desactivar promoción' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Promoción desactivada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Promoción no encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Activar promoción' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Promoción activada exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Promoción no encontrada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "activate", null);
__decorate([
    (0, common_1.Post)('desactivar-vencidas'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Desactivar promociones vencidas' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Promociones vencidas desactivadas' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PromocionesController.prototype, "desactivarVencidas", null);
exports.PromocionesController = PromocionesController = __decorate([
    (0, swagger_1.ApiTags)('Promociones'),
    (0, common_1.Controller)('promociones'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [promociones_service_1.PromocionesService])
], PromocionesController);
//# sourceMappingURL=promociones.controller.js.map