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
exports.ProductosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const productos_service_1 = require("./productos.service");
const create_producto_dto_1 = require("./dto/create-producto.dto");
const update_producto_dto_1 = require("./dto/update-producto.dto");
const actualizar_stock_dto_1 = require("./dto/actualizar-stock.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const usuario_entity_1 = require("../../entities/usuario.entity");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let ProductosController = class ProductosController {
    productosService;
    constructor(productosService) {
        this.productosService = productosService;
    }
    create(createProductoDto, user) {
        return this.productosService.create(createProductoDto, user.username);
    }
    findAll(paginationDto) {
        return this.productosService.findAll(paginationDto);
    }
    search(query, paginationDto) {
        return this.productosService.search(query, paginationDto);
    }
    getCategorias() {
        return this.productosService.getCategorias();
    }
    getStockBajo() {
        return this.productosService.findStockBajo();
    }
    findByCategoria(categoria, paginationDto) {
        return this.productosService.findByCategoria(categoria, paginationDto);
    }
    findByCodigoBarra(codigoBarra) {
        return this.productosService.findByCodigoBarra(codigoBarra);
    }
    getMovimientosInventario(paginationDto) {
        return this.productosService.getMovimientosInventario(paginationDto);
    }
    getMovimientosByProducto(codigoBarra, paginationDto) {
        return this.productosService.getMovimientosByProducto(codigoBarra, paginationDto);
    }
    findOne(id) {
        return this.productosService.findById(id);
    }
    update(id, updateProductoDto) {
        return this.productosService.update(id, updateProductoDto);
    }
    actualizarStock(id, actualizarStockDto, user) {
        return this.productosService.actualizarStock(id, actualizarStockDto, user.username);
    }
    remove(id) {
        return this.productosService.remove(id);
    }
    activate(id) {
        return this.productosService.activate(id);
    }
};
exports.ProductosController = ProductosController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.INVENTARIOS),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nuevo producto' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Producto creado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'El código de barras ya existe' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_producto_dto_1.CreateProductoDto, usuario_entity_1.Usuario]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO, usuario_entity_1.UserRole.INVENTARIOS),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los productos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de productos obtenida exitosamente' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO, usuario_entity_1.UserRole.INVENTARIOS),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar productos por descripción, código de barras, categoría o proveedor' }),
    (0, swagger_1.ApiQuery)({ name: 'q', description: 'Término de búsqueda' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Resultados de búsqueda obtenidos exitosamente' }),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('categorias'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO, usuario_entity_1.UserRole.INVENTARIOS),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las categorías de productos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de categorías obtenida exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "getCategorias", null);
__decorate([
    (0, common_1.Get)('stock-bajo'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.INVENTARIOS),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener productos con stock bajo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de productos con stock bajo obtenida exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "getStockBajo", null);
__decorate([
    (0, common_1.Get)('categoria/:categoria'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO, usuario_entity_1.UserRole.INVENTARIOS),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener productos por categoría' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Productos de la categoría obtenidos exitosamente' }),
    __param(0, (0, common_1.Param)('categoria')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "findByCategoria", null);
__decorate([
    (0, common_1.Get)('codigo/:codigoBarra'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO, usuario_entity_1.UserRole.INVENTARIOS),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener producto por código de barras' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' }),
    __param(0, (0, common_1.Param)('codigoBarra')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "findByCodigoBarra", null);
__decorate([
    (0, common_1.Get)('movimientos'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.INVENTARIOS),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener historial de movimientos de inventario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Historial de movimientos obtenido exitosamente' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "getMovimientosInventario", null);
__decorate([
    (0, common_1.Get)('movimientos/:codigoBarra'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.INVENTARIOS),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener movimientos de inventario por producto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movimientos del producto obtenidos exitosamente' }),
    __param(0, (0, common_1.Param)('codigoBarra')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "getMovimientosByProducto", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO, usuario_entity_1.UserRole.INVENTARIOS),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener producto por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.INVENTARIOS),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar producto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto actualizado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_producto_dto_1.UpdateProductoDto]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/stock'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.INVENTARIOS),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar stock del producto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Stock actualizado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, actualizar_stock_dto_1.ActualizarStockDto,
        usuario_entity_1.Usuario]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "actualizarStock", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.INVENTARIOS),
    (0, swagger_1.ApiOperation)({ summary: 'Ocultar producto (soft delete)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto ocultado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/activate'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.INVENTARIOS),
    (0, swagger_1.ApiOperation)({ summary: 'Mostrar producto nuevamente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Producto activado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Producto no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "activate", null);
exports.ProductosController = ProductosController = __decorate([
    (0, swagger_1.ApiTags)('Productos'),
    (0, common_1.Controller)('productos'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [productos_service_1.ProductosService])
], ProductosController);
//# sourceMappingURL=productos.controller.js.map