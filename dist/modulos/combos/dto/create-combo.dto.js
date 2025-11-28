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
exports.CreateComboDto = exports.ProductoComboDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class ProductoComboDto {
    productoId;
    cantidad;
}
exports.ProductoComboDto = ProductoComboDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del producto', example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ProductoComboDto.prototype, "productoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cantidad del producto en el combo', example: 2 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], ProductoComboDto.prototype, "cantidad", void 0);
class CreateComboDto {
    nombre;
    descripcion;
    productos;
    precioOriginal;
    precioCombo;
    puntosExtra;
    active;
}
exports.CreateComboDto = CreateComboDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del combo', example: 'Combo Familiar' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateComboDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Descripción del combo', example: '2 hamburguesas + 2 papas + 2 gaseosas' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateComboDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Productos incluidos en el combo',
        type: [ProductoComboDto],
        example: [
            { productoId: 1, cantidad: 2 },
            { productoId: 2, cantidad: 2 }
        ]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(2),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ProductoComboDto),
    __metadata("design:type", Array)
], CreateComboDto.prototype, "productos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Precio original sin descuento', example: 45.00 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateComboDto.prototype, "precioOriginal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Precio del combo con descuento', example: 35.00 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateComboDto.prototype, "precioCombo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Puntos extra por comprar el combo', example: 10 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateComboDto.prototype, "puntosExtra", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Si el combo está activo', example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateComboDto.prototype, "active", void 0);
//# sourceMappingURL=create-combo.dto.js.map