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
exports.CreateMovimientoDto = exports.TipoMovimiento = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
var TipoMovimiento;
(function (TipoMovimiento) {
    TipoMovimiento["ENTRADA"] = "ENTRADA";
    TipoMovimiento["SALIDA"] = "SALIDA";
    TipoMovimiento["AJUSTE"] = "AJUSTE";
})(TipoMovimiento || (exports.TipoMovimiento = TipoMovimiento = {}));
class CreateMovimientoDto {
    codigoBarra;
    tipo;
    cantidad;
    costo;
    precioVenta;
    cajero;
    proveedor;
}
exports.CreateMovimientoDto = CreateMovimientoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Código de barras del producto', example: '7501234567890' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMovimientoDto.prototype, "codigoBarra", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de movimiento',
        enum: TipoMovimiento,
        example: TipoMovimiento.ENTRADA
    }),
    (0, class_validator_1.IsEnum)(TipoMovimiento),
    __metadata("design:type", String)
], CreateMovimientoDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cantidad del movimiento', example: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateMovimientoDto.prototype, "cantidad", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Costo unitario del producto', example: 15.50 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateMovimientoDto.prototype, "costo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Precio de venta del producto', example: 25.00 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateMovimientoDto.prototype, "precioVenta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del cajero que realiza el movimiento', example: 'Juan Pérez' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMovimientoDto.prototype, "cajero", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Proveedor del producto', example: 'Distribuidora ABC' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMovimientoDto.prototype, "proveedor", void 0);
//# sourceMappingURL=create-movimiento.dto.js.map