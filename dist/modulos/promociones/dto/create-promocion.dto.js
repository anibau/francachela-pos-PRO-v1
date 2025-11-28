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
exports.CreatePromocionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const promocion_entity_1 = require("../../../entities/promocion.entity");
class CreatePromocionDto {
    nombre;
    descripcion;
    tipo;
    descuento;
    fechaInicio;
    fechaFin;
    productosAplicables;
    montoMinimo;
    cantidadMaximaUsos;
    activo = true;
}
exports.CreatePromocionDto = CreatePromocionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre de la promoción', example: 'Descuento de Verano' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePromocionDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Descripción de la promoción', example: '20% de descuento en bebidas' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePromocionDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Tipo de promoción',
        enum: promocion_entity_1.TipoPromocion,
        example: promocion_entity_1.TipoPromocion.PORCENTAJE
    }),
    (0, class_validator_1.IsEnum)(promocion_entity_1.TipoPromocion),
    __metadata("design:type", String)
], CreatePromocionDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Valor del descuento (porcentaje o monto fijo)', example: 20 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreatePromocionDto.prototype, "descuento", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de inicio de la promoción', example: '2024-01-01' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreatePromocionDto.prototype, "fechaInicio", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Fecha de fin de la promoción', example: '2024-01-31' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], CreatePromocionDto.prototype, "fechaFin", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Productos aplicables (IDs)', example: [1, 2, 3] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreatePromocionDto.prototype, "productosAplicables", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Monto mínimo de compra', example: 50.00 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreatePromocionDto.prototype, "montoMinimo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cantidad máxima de usos', example: 100 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreatePromocionDto.prototype, "cantidadMaximaUsos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Si la promoción está activa', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePromocionDto.prototype, "activo", void 0);
//# sourceMappingURL=create-promocion.dto.js.map