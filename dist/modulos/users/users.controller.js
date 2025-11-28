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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const usuario_entity_1 = require("../../entities/usuario.entity");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    create(createUserDto) {
        return this.usersService.create(createUserDto);
    }
    findAll(paginationDto) {
        return this.usersService.findAll(paginationDto);
    }
    findOne(id) {
        return this.usersService.findById(id);
    }
    update(id, updateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
    remove(id) {
        return this.usersService.remove(id);
    }
    activate(id) {
        return this.usersService.activate(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nuevo usuario' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Usuario creado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'El nombre de usuario ya existe' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los usuarios' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de usuarios obtenida exitosamente' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener usuario por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuario encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuario actualizado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Desactivar usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuario desactivado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Activar usuario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Usuario activado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Usuario no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "activate", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Usuarios'),
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map