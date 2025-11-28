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
exports.GastosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const gastos_service_1 = require("./gastos.service");
const create_gasto_dto_1 = require("./dto/create-gasto.dto");
const update_gasto_dto_1 = require("./dto/update-gasto.dto");
const jwt_auth_guard_1 = require("../../../src/modulos/auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const usuario_entity_1 = require("../../entities/usuario.entity");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
const gasto_entity_1 = require("../../entities/gasto.entity");
let GastosController = class GastosController {
    gastosService;
    constructor(gastosService) {
        this.gastosService = gastosService;
    }
    create(createGastoDto, user) {
        return this.gastosService.create(createGastoDto, user.username);
    }
    findAll(paginationDto) {
        return this.gastosService.findAll(paginationDto);
    }
    getGastosDelDia() {
        return this.gastosService.getGastosDelDia();
    }
    getCategorias() {
        return this.gastosService.getCategorias();
    }
    getEstadisticas(fechaInicio, fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        return this.gastosService.getEstadisticasGastos(inicio, fin);
    }
    search(query, paginationDto) {
        return this.gastosService.search(query, paginationDto);
    }
    findByDateRange(fechaInicio, fechaFin, paginationDto) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        return this.gastosService.findByDateRange(inicio, fin, paginationDto);
    }
    findByCategoria(categoria, paginationDto) {
        return this.gastosService.findByCategoria(categoria, paginationDto);
    }
    findByCajero(cajero, paginationDto) {
        return this.gastosService.findByCajero(cajero, paginationDto);
    }
    findOne(id) {
        return this.gastosService.findById(id);
    }
    update(id, updateGastoDto) {
        return this.gastosService.update(id, updateGastoDto);
    }
    remove(id) {
        return this.gastosService.remove(id);
    }
};
exports.GastosController = GastosController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar nuevo gasto' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Gasto registrado exitosamente' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_gasto_dto_1.CreateGastoDto, usuario_entity_1.Usuario]),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los gastos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de gastos obtenida exitosamente' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('hoy'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener gastos del día actual' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gastos del día obtenidos exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "getGastosDelDia", null);
__decorate([
    (0, common_1.Get)('categorias'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener categorías de gastos disponibles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categorías obtenidas exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "getCategorias", null);
__decorate([
    (0, common_1.Get)('estadisticas'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener estadísticas de gastos por rango de fechas' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estadísticas obtenidas exitosamente' }),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "getEstadisticas", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar gastos por descripción, proveedor o comprobante' }),
    (0, swagger_1.ApiQuery)({ name: 'q', description: 'Término de búsqueda' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Resultados de búsqueda obtenidos exitosamente' }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('rango'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener gastos por rango de fechas' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gastos del rango obtenidos exitosamente' }),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "findByDateRange", null);
__decorate([
    (0, common_1.Get)('categoria/:categoria'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener gastos por categoría' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gastos por categoría obtenidos exitosamente' }),
    __param(0, (0, common_1.Param)('categoria')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "findByCategoria", null);
__decorate([
    (0, common_1.Get)('cajero/:cajero'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener gastos por cajero' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gastos del cajero obtenidos exitosamente' }),
    __param(0, (0, common_1.Param)('cajero')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "findByCajero", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener gasto por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gasto encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Gasto no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar gasto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gasto actualizado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Gasto no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_gasto_dto_1.UpdateGastoDto]),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar gasto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Gasto eliminado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Gasto no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], GastosController.prototype, "remove", null);
exports.GastosController = GastosController = __decorate([
    (0, swagger_1.ApiTags)('Gastos'),
    (0, common_1.Controller)('gastos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [gastos_service_1.GastosService])
], GastosController);
//# sourceMappingURL=gastos.controller.js.map