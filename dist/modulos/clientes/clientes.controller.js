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
exports.ClientesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const clientes_service_1 = require("./clientes.service");
const create_cliente_dto_1 = require("./dto/create-cliente.dto");
const update_cliente_dto_1 = require("./dto/update-cliente.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const usuario_entity_1 = require("../../entities/usuario.entity");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let ClientesController = class ClientesController {
    clientesService;
    constructor(clientesService) {
        this.clientesService = clientesService;
    }
    create(createClienteDto) {
        return this.clientesService.create(createClienteDto);
    }
    findAll(paginationDto) {
        return this.clientesService.findAll(paginationDto);
    }
    search(query, paginationDto) {
        return this.clientesService.search(query, paginationDto);
    }
    getCumpleaneros() {
        return this.clientesService.findCumpleaneros();
    }
    getTopClientes(limit) {
        return this.clientesService.findTopClientes(limit);
    }
    findByDni(dni) {
        return this.clientesService.findByDni(dni);
    }
    findByCodigoCorto(codigoCorto) {
        return this.clientesService.findByCodigoCorto(codigoCorto);
    }
    findOne(id) {
        return this.clientesService.findById(id);
    }
    getEstadisticas(id) {
        return this.clientesService.getEstadisticasCliente(id);
    }
    update(id, updateClienteDto) {
        return this.clientesService.update(id, updateClienteDto);
    }
    remove(id) {
        return this.clientesService.remove(id);
    }
    activate(id) {
        return this.clientesService.activate(id);
    }
};
exports.ClientesController = ClientesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nuevo cliente' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Cliente creado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'El DNI ya está registrado' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cliente_dto_1.CreateClienteDto]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los clientes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de clientes obtenida exitosamente' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar clientes por nombre, apellido, DNI, teléfono o código' }),
    (0, swagger_1.ApiQuery)({ name: 'q', description: 'Término de búsqueda' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Resultados de búsqueda obtenidos exitosamente' }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('cumpleaneros'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener clientes que cumplen años hoy' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de cumpleañeros obtenida exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "getCumpleaneros", null);
__decorate([
    (0, common_1.Get)('top'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener clientes con más puntos' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Número de clientes a obtener', example: 10 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Top clientes obtenidos exitosamente' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "getTopClientes", null);
__decorate([
    (0, common_1.Get)('dni/:dni'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener cliente por DNI' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cliente encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente no encontrado' }),
    __param(0, (0, common_1.Param)('dni')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "findByDni", null);
__decorate([
    (0, common_1.Get)('codigo/:codigoCorto'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener cliente por código corto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cliente encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente no encontrado' }),
    __param(0, (0, common_1.Param)('codigoCorto')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "findByCodigoCorto", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener cliente por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cliente encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(':id/estadisticas'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener estadísticas del cliente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estadísticas del cliente obtenidas exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "getEstadisticas", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar cliente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cliente actualizado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_cliente_dto_1.UpdateClienteDto]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Desactivar cliente (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cliente desactivado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Activar cliente nuevamente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Cliente activado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Cliente no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "activate", null);
exports.ClientesController = ClientesController = __decorate([
    (0, swagger_1.ApiTags)('Clientes'),
    (0, common_1.Controller)('clientes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [clientes_service_1.ClientesService])
], ClientesController);
//# sourceMappingURL=clientes.controller.js.map