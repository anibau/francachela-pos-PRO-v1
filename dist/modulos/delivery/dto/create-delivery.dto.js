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
exports.CreateDeliveryDto = exports.EstadoDelivery = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
var EstadoDelivery;
(function (EstadoDelivery) {
    EstadoDelivery["PENDIENTE"] = "PENDIENTE";
    EstadoDelivery["ASIGNADO"] = "ASIGNADO";
    EstadoDelivery["EN_CAMINO"] = "EN_CAMINO";
    EstadoDelivery["ENTREGADO"] = "ENTREGADO";
    EstadoDelivery["CANCELADO"] = "CANCELADO";
})(EstadoDelivery || (exports.EstadoDelivery = EstadoDelivery = {}));
class CreateDeliveryDto {
    clienteId;
    pedidoId;
    direccion;
    repartidor;
    phone;
    deliveryFee;
    notes;
}
exports.CreateDeliveryDto = CreateDeliveryDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'ID del cliente', example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateDeliveryDto.prototype, "clienteId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID del pedido/venta', example: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateDeliveryDto.prototype, "pedidoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Dirección de entrega', example: 'Av. Principal 123, San Isidro' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDeliveryDto.prototype, "direccion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Nombre del repartidor', example: 'Juan Pérez' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDeliveryDto.prototype, "repartidor", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Teléfono de contacto', example: '987654321' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeliveryDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Costo del delivery', example: 5.00 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateDeliveryDto.prototype, "deliveryFee", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notas adicionales', example: 'Casa de color azul, segundo piso' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDeliveryDto.prototype, "notes", void 0);
//# sourceMappingURL=create-delivery.dto.js.map