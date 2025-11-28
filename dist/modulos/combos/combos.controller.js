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
exports.CombosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const combos_service_1 = require("./combos.service");
const create_combo_dto_1 = require("./dto/create-combo.dto");
const update_combo_dto_1 = require("./dto/update-combo.dto");
const jwt_auth_guard_1 = require("../../../src/modulos/auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const usuario_entity_1 = require("../../entities/usuario.entity");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let CombosController = class CombosController {
    combosService;
    constructor(combosService) {
        this.combosService = combosService;
    }
    create(createComboDto) {
        return this.combosService.create(createComboDto);
    }
    findAll(paginationDto) {
        return this.combosService.findAll(paginationDto);
    }
    findActivos(paginationDto) {
        return this.combosService.findActivos(paginationDto);
    }
    getCombosPopulares(limit) {
        return this.combosService.getCombosPopulares(limit);
    }
    findOne(id) {
        return this.combosService.findById(id);
    }
    verificarDisponibilidad(id) {
        return this.combosService.verificarDisponibilidad(id);
    }
    calcularAhorro(id) {
        return this.combosService.calcularAhorro(id);
    }
    update(id, updateComboDto) {
        return this.combosService.update(id, updateComboDto);
    }
    activate(id) {
        return this.combosService.activate(id);
    }
    deactivate(id) {
        return this.combosService.deactivate(id);
    }
    remove(id) {
        return this.combosService.remove(id);
    }
};
exports.CombosController = CombosController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nuevo combo' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Combo creado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_combo_dto_1.CreateComboDto]),
    __metadata("design:returntype", void 0)
], CombosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los combos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de combos obtenida exitosamente' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], CombosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('activos'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener combos activos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Combos activos obtenidos exitosamente' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], CombosController.prototype, "findActivos", null);
__decorate([
    (0, common_1.Get)('populares'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener combos más populares' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Límite de resultados' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Combos populares obtenidos exitosamente' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CombosController.prototype, "getCombosPopulares", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener combo por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Combo encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Combo no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CombosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/disponibilidad'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Verificar disponibilidad del combo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Disponibilidad verificada' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CombosController.prototype, "verificarDisponibilidad", null);
__decorate([
    (0, common_1.Get)(':id/ahorro'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Calcular ahorro del combo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Ahorro calculado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CombosController.prototype, "calcularAhorro", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar combo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Combo actualizado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Combo no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_combo_dto_1.UpdateComboDto]),
    __metadata("design:returntype", void 0)
], CombosController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Activar combo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Combo activado exitosamente' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CombosController.prototype, "activate", null);
__decorate([
    (0, common_1.Patch)(':id/deactivate'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Desactivar combo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Combo desactivado exitosamente' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CombosController.prototype, "deactivate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar combo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Combo eliminado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Combo no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CombosController.prototype, "remove", null);
exports.CombosController = CombosController = __decorate([
    (0, swagger_1.ApiTags)('Combos'),
    (0, common_1.Controller)('combos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [combos_service_1.CombosService])
], CombosController);
//# sourceMappingURL=combos.controller.js.map