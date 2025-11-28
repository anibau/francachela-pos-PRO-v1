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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportVentasDto = exports.TipoReporte = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
var TipoReporte;
(function (TipoReporte) {
    TipoReporte["VENTAS"] = "VENTAS";
    TipoReporte["PRODUCTOS"] = "PRODUCTOS";
    TipoReporte["CLIENTES"] = "CLIENTES";
    TipoReporte["INVENTARIO"] = "INVENTARIO";
    TipoReporte["DELIVERY"] = "DELIVERY";
})(TipoReporte || (exports.TipoReporte = TipoReporte = {}));
class ExportVentasDto {
    fechaInicio;
    fechaFin;
    tipoReporte;
    incluirDetalles;
}
exports.ExportVentasDto = ExportVentasDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fecha de inicio (YYYY-MM-DD)', example: '2024-01-01' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ExportVentasDto.prototype, "fechaInicio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Fecha de fin (YYYY-MM-DD)', example: '2024-12-31' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ExportVentasDto.prototype, "fechaFin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tipo de reporte a exportar',
        enum: TipoReporte,
        example: TipoReporte.VENTAS
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(TipoReporte),
    __metadata("design:type", String)
], ExportVentasDto.prototype, "tipoReporte", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Incluir detalles de productos', example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    __metadata("design:type", Boolean)
], ExportVentasDto.prototype, "incluirDetalles", void 0);
//# sourceMappingURL=export-ventas.dto.js.map