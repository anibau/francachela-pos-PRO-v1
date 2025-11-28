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
exports.MovimientoInventarioController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const movimiento_inventario_service_1 = require("./movimiento-inventario.service");
const create_movimiento_dto_1 = require("./dto/create-movimiento.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const enums_1 = require("../../common/enums");
const pagination_dto_1 = require("../../common/dto/pagination.dto");
let MovimientoInventarioController = class MovimientoInventarioController {
    movimientoInventarioService;
    constructor(movimientoInventarioService) {
        this.movimientoInventarioService = movimientoInventarioService;
    }
    create(createMovimientoDto) {
        return this.movimientoInventarioService.create(createMovimientoDto);
    }
    findAll(paginationDto) {
        return this.movimientoInventarioService.findAll(paginationDto);
    }
    getMovimientosDelDia() {
        return this.movimientoInventarioService.getMovimientosDelDia();
    }
    getEstadisticas(fechaInicio, fechaFin) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        return this.movimientoInventarioService.getEstadisticasMovimientos(inicio, fin);
    }
    findByProducto(codigoBarra, paginationDto) {
        return this.movimientoInventarioService.findByProducto(codigoBarra, paginationDto);
    }
    findByTipo(tipo, paginationDto) {
        return this.movimientoInventarioService.findByTipo(tipo, paginationDto);
    }
    findByCajero(cajero, paginationDto) {
        return this.movimientoInventarioService.findByCajero(cajero, paginationDto);
    }
    findByDateRange(fechaInicio, fechaFin, paginationDto) {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        return this.movimientoInventarioService.findByDateRange(inicio, fin, paginationDto);
    }
    findOne(id) {
        return this.movimientoInventarioService.findById(id);
    }
    registrarEntrada(body) {
        return this.movimientoInventarioService.registrarEntrada(body.codigoBarra, body.cantidad, body.costo, body.precioVenta, body.cajero, body.proveedor);
    }
    registrarAjuste(body) {
        return this.movimientoInventarioService.registrarAjuste(body.codigoBarra, body.nuevaCantidad, body.costo, body.precioVenta, body.cajero);
    }
    registrarVenta(body) {
        return this.movimientoInventarioService.registrarVenta(body.codigoBarra, body.cantidad, body.precioVenta, body.cajero);
    }
};
exports.MovimientoInventarioController = MovimientoInventarioController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.INVENTARIOS),
    (0, swagger_1.ApiOperation)({ summary: 'Crear nuevo movimiento de inventario' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Movimiento creado exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos inválidos o stock insuficiente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_movimiento_dto_1.CreateMovimientoDto]),
    __metadata("design:returntype", void 0)
], MovimientoInventarioController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.INVENTARIOS, enums_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los movimientos de inventario' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de movimientos obtenida exitosamente' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], MovimientoInventarioController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('hoy'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.INVENTARIOS, enums_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener movimientos del día actual' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movimientos del día obtenidos exitosamente' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MovimientoInventarioController.prototype, "getMovimientosDelDia", null);
__decorate([
    (0, common_1.Get)('estadisticas'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.INVENTARIOS),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener estadísticas de movimientos por rango de fechas' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Estadísticas obtenidas exitosamente' }),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MovimientoInventarioController.prototype, "getEstadisticas", null);
__decorate([
    (0, common_1.Get)('producto/:codigoBarra'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.INVENTARIOS, enums_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener movimientos por producto' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movimientos del producto obtenidos exitosamente' }),
    __param(0, (0, common_1.Param)('codigoBarra')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], MovimientoInventarioController.prototype, "findByProducto", null);
__decorate([
    (0, common_1.Get)('tipo/:tipo'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.INVENTARIOS, enums_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener movimientos por tipo' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movimientos por tipo obtenidos exitosamente' }),
    __param(0, (0, common_1.Param)('tipo')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], MovimientoInventarioController.prototype, "findByTipo", null);
__decorate([
    (0, common_1.Get)('cajero/:cajero'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.INVENTARIOS),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener movimientos por cajero' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movimientos del cajero obtenidos exitosamente' }),
    __param(0, (0, common_1.Param)('cajero')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], MovimientoInventarioController.prototype, "findByCajero", null);
__decorate([
    (0, common_1.Get)('rango'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.INVENTARIOS, enums_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener movimientos por rango de fechas' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaInicio', description: 'Fecha de inicio (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaFin', description: 'Fecha de fin (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movimientos del rango obtenidos exitosamente' }),
    __param(0, (0, common_1.Query)('fechaInicio')),
    __param(1, (0, common_1.Query)('fechaFin')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], MovimientoInventarioController.prototype, "findByDateRange", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.INVENTARIOS, enums_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener movimiento por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Movimiento encontrado' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Movimiento no encontrado' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MovimientoInventarioController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('entrada'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.INVENTARIOS),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar entrada de mercancía' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Entrada registrada exitosamente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MovimientoInventarioController.prototype, "registrarEntrada", null);
__decorate([
    (0, common_1.Post)('ajuste'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.INVENTARIOS),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar ajuste de inventario' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Ajuste registrado exitosamente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MovimientoInventarioController.prototype, "registrarAjuste", null);
__decorate([
    (0, common_1.Post)('venta'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar salida por venta' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Venta registrada exitosamente' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MovimientoInventarioController.prototype, "registrarVenta", null);
exports.MovimientoInventarioController = MovimientoInventarioController = __decorate([
    (0, swagger_1.ApiTags)('Movimiento Inventario'),
    (0, common_1.Controller)('movimiento-inventario'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [movimiento_inventario_service_1.MovimientoInventarioService])
], MovimientoInventarioController);
//# sourceMappingURL=movimiento-inventario.controller.js.map