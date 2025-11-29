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
exports.CreateVentaDto = exports.ItemVentaDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../../../common/enums");
class ItemVentaDto {
    productoId;
    cantidad;
    precioUnitario;
}
exports.ItemVentaDto = ItemVentaDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del producto', example: 1 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ItemVentaDto.prototype, "productoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cantidad del producto', example: 2 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ItemVentaDto.prototype, "cantidad", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Precio unitario (si es diferente al precio del producto)', example: 4.50 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ItemVentaDto.prototype, "precioUnitario", void 0);
class CreateVentaDto {
    clienteId;
    listaProductos;
    descuento = 0;
    metodoPago;
    comentario;
    tipoCompra = enums_1.TipoCompra.LOCAL;
    montoRecibido;
    puntosUsados = 0;
}
exports.CreateVentaDto = CreateVentaDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del cliente (opcional)', example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateVentaDto.prototype, "clienteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Lista de productos de la venta',
        type: [ItemVentaDto]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ItemVentaDto),
    __metadata("design:type", Array)
], CreateVentaDto.prototype, "listaProductos", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Descuento aplicado', example: 5.00, default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateVentaDto.prototype, "descuento", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Método de pago',
        enum: enums_1.MetodoPago,
        example: enums_1.MetodoPago.EFECTIVO
    }),
    (0, class_validator_1.IsEnum)(enums_1.MetodoPago),
    __metadata("design:type", String)
], CreateVentaDto.prototype, "metodoPago", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Comentario de la venta', example: 'Cliente frecuente' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVentaDto.prototype, "comentario", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tipo de compra',
        enum: enums_1.TipoCompra,
        example: enums_1.TipoCompra.LOCAL,
        default: enums_1.TipoCompra.LOCAL
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.TipoCompra),
    __metadata("design:type", String)
], CreateVentaDto.prototype, "tipoCompra", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Monto recibido (para efectivo)', example: 50.00 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateVentaDto.prototype, "montoRecibido", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Puntos a usar del cliente', example: 10, default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateVentaDto.prototype, "puntosUsados", void 0);
//# sourceMappingURL=create-venta.dto.js.map