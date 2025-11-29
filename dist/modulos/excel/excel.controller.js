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
exports.ExcelController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const excel_service_1 = require("./excel.service");
const export_ventas_dto_1 = require("./dto/export-ventas.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const usuario_entity_1 = require("../../entities/usuario.entity");
let ExcelController = class ExcelController {
    excelService;
    constructor(excelService) {
        this.excelService = excelService;
    }
    async exportVentas(exportDto, res) {
        exportDto.tipoReporte = export_ventas_dto_1.TipoReporte.VENTAS;
        const buffer = await this.excelService.exportVentas(exportDto);
        const filename = `ventas_${new Date().toISOString().split('T')[0]}.xlsx`;
        res.set({
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': buffer.length.toString(),
        });
        res.end(buffer);
    }
    async exportProductos(res) {
        const exportDto = { tipoReporte: export_ventas_dto_1.TipoReporte.PRODUCTOS };
        const buffer = await this.excelService.exportVentas(exportDto);
        const filename = `productos_${new Date().toISOString().split('T')[0]}.xlsx`;
        res.set({
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': buffer.length.toString(),
        });
        res.end(buffer);
    }
    async exportClientes(res) {
        const exportDto = { tipoReporte: export_ventas_dto_1.TipoReporte.CLIENTES };
        const buffer = await this.excelService.exportVentas(exportDto);
        const filename = `clientes_${new Date().toISOString().split('T')[0]}.xlsx`;
        res.set({
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': buffer.length.toString(),
        });
        res.end(buffer);
    }
    async exportInventario(exportDto, res) {
        exportDto.tipoReporte = export_ventas_dto_1.TipoReporte.INVENTARIO;
        const buffer = await this.excelService.exportVentas(exportDto);
        const filename = `inventario_${new Date().toISOString().split('T')[0]}.xlsx`;
        res.set({
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': buffer.length.toString(),
        });
        res.end(buffer);
    }
    async exportDelivery(exportDto, res) {
        exportDto.tipoReporte = export_ventas_dto_1.TipoReporte.DELIVERY;
        const buffer = await this.excelService.exportVentas(exportDto);
        const filename = `delivery_${new Date().toISOString().split('T')[0]}.xlsx`;
        res.set({
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': buffer.length.toString(),
        });
        res.end(buffer);
    }
};
exports.ExcelController = ExcelController;
__decorate([
    (0, common_1.Get)('export-ventas'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Exportar ventas a Excel' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaInicio', required: false, description: 'Fecha inicio (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaFin', required: false, description: 'Fecha fin (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'incluirDetalles', required: false, description: 'Incluir detalles de productos' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Archivo Excel generado exitosamente' }),
    (0, common_1.Header)('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [export_ventas_dto_1.ExportVentasDto, Object]),
    __metadata("design:returntype", Promise)
], ExcelController.prototype, "exportVentas", null);
__decorate([
    (0, common_1.Get)('export-productos'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.INVENTARIOS),
    (0, swagger_1.ApiOperation)({ summary: 'Exportar productos a Excel' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Archivo Excel generado exitosamente' }),
    (0, common_1.Header)('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExcelController.prototype, "exportProductos", null);
__decorate([
    (0, common_1.Get)('export-clientes'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Exportar clientes a Excel' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Archivo Excel generado exitosamente' }),
    (0, common_1.Header)('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ExcelController.prototype, "exportClientes", null);
__decorate([
    (0, common_1.Get)('export-inventario'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.INVENTARIOS),
    (0, swagger_1.ApiOperation)({ summary: 'Exportar movimientos de inventario a Excel' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaInicio', required: false, description: 'Fecha inicio (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaFin', required: false, description: 'Fecha fin (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Archivo Excel generado exitosamente' }),
    (0, common_1.Header)('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [export_ventas_dto_1.ExportVentasDto, Object]),
    __metadata("design:returntype", Promise)
], ExcelController.prototype, "exportInventario", null);
__decorate([
    (0, common_1.Get)('export-delivery'),
    (0, roles_decorator_1.Roles)(usuario_entity_1.UserRole.ADMIN, usuario_entity_1.UserRole.CAJERO),
    (0, swagger_1.ApiOperation)({ summary: 'Exportar deliveries a Excel' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaInicio', required: false, description: 'Fecha inicio (YYYY-MM-DD)' }),
    (0, swagger_1.ApiQuery)({ name: 'fechaFin', required: false, description: 'Fecha fin (YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Archivo Excel generado exitosamente' }),
    (0, common_1.Header)('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [export_ventas_dto_1.ExportVentasDto, Object]),
    __metadata("design:returntype", Promise)
], ExcelController.prototype, "exportDelivery", null);
exports.ExcelController = ExcelController = __decorate([
    (0, swagger_1.ApiTags)('Excel Export'),
    (0, common_1.Controller)('excel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [excel_service_1.ExcelService])
], ExcelController);
//# sourceMappingURL=excel.controller.js.map