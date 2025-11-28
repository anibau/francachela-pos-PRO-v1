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
exports.CreateProductoDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class CreateProductoDto {
    productoDescripcion;
    codigoBarra;
    imagen;
    costo;
    precio;
    precioMayoreo;
    cantidadActual;
    cantidadMinima;
    proveedor;
    categoria;
    valorPuntos = 0;
    mostrar = true;
    usaInventario = true;
}
exports.CreateProductoDto = CreateProductoDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Descripción del producto', example: 'Cerveza Pilsen 650ml' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProductoDto.prototype, "productoDescripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Código de barras único', example: '7751271001234' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateProductoDto.prototype, "codigoBarra", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'URL de la imagen del producto' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductoDto.prototype, "imagen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Costo del producto', example: 2.50 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateProductoDto.prototype, "costo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Precio de venta', example: 4.00 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateProductoDto.prototype, "precio", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Precio de mayoreo', example: 3.50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateProductoDto.prototype, "precioMayoreo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cantidad actual en stock', example: 100 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateProductoDto.prototype, "cantidadActual", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cantidad mínima en stock', example: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateProductoDto.prototype, "cantidadMinima", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Proveedor del producto', example: 'Backus' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductoDto.prototype, "proveedor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Categoría del producto', example: 'Bebidas' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateProductoDto.prototype, "categoria", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Valor en puntos del producto', example: 5, default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateProductoDto.prototype, "valorPuntos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Si el producto se muestra en el sistema', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProductoDto.prototype, "mostrar", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Si el producto usa control de inventario', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateProductoDto.prototype, "usaInventario", void 0);
//# sourceMappingURL=create-producto.dto.js.map