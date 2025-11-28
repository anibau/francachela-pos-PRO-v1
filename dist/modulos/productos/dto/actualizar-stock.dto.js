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
exports.ActualizarStockDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../../../common/enums");
class ActualizarStockDto {
    cantidad;
    tipo;
    observaciones;
    proveedor;
    numeroFactura;
}
exports.ActualizarStockDto = ActualizarStockDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Cantidad a modificar o nueva cantidad total (según el tipo)',
        example: 50
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ActualizarStockDto.prototype, "cantidad", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de movimiento de inventario',
        enum: enums_1.TipoMovimiento,
        example: enums_1.TipoMovimiento.ENTRADA
    }),
    (0, class_validator_1.IsEnum)(enums_1.TipoMovimiento),
    __metadata("design:type", String)
], ActualizarStockDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Observaciones del movimiento',
        example: 'Compra de mercancía'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActualizarStockDto.prototype, "observaciones", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Proveedor (para movimientos de entrada)',
        example: 'Distribuidora ABC'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActualizarStockDto.prototype, "proveedor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Número de factura o comprobante',
        example: 'F001-00001234'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ActualizarStockDto.prototype, "numeroFactura", void 0);
//# sourceMappingURL=actualizar-stock.dto.js.map