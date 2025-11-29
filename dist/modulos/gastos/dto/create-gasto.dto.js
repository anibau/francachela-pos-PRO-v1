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
exports.CreateGastoDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../../../common/enums");
class CreateGastoDto {
    descripcion;
    monto;
    categoria;
    metodoPago;
    proveedor;
    numeroComprobante;
    comprobante;
}
exports.CreateGastoDto = CreateGastoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripción del gasto', example: 'Compra de productos de limpieza' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateGastoDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Monto del gasto', example: 25.50 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateGastoDto.prototype, "monto", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Categoría del gasto',
        enum: enums_1.CategoriaGasto,
        example: enums_1.CategoriaGasto.OPERATIVO
    }),
    (0, class_validator_1.IsEnum)(enums_1.CategoriaGasto),
    __metadata("design:type", String)
], CreateGastoDto.prototype, "categoria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Método de pago utilizado',
        enum: enums_1.MetodoPago,
        example: enums_1.MetodoPago.EFECTIVO
    }),
    (0, class_validator_1.IsEnum)(enums_1.MetodoPago),
    __metadata("design:type", String)
], CreateGastoDto.prototype, "metodoPago", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Proveedor del gasto', example: 'Distribuidora ABC' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGastoDto.prototype, "proveedor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Número de comprobante', example: 'F001-00001234' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGastoDto.prototype, "numeroComprobante", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Archivo de comprobante (URL)', example: 'https://example.com/comprobante.pdf' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateGastoDto.prototype, "comprobante", void 0);
//# sourceMappingURL=create-gasto.dto.js.map