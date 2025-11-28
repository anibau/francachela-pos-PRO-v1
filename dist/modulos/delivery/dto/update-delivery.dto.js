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
exports.UpdateDeliveryDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_delivery_dto_1 = require("./create-delivery.dto");
const enums_1 = require("../../../common/enums");
const class_validator_1 = require("class-validator");
const swagger_2 = require("@nestjs/swagger");
class UpdateDeliveryDto extends (0, swagger_1.PartialType)(create_delivery_dto_1.CreateDeliveryDto) {
    estado;
    horaSalida;
    horaEntrega;
}
exports.UpdateDeliveryDto = UpdateDeliveryDto;
__decorate([
    (0, swagger_2.ApiPropertyOptional)({
        description: 'Estado del delivery',
        enum: enums_1.EstadoDelivery,
        example: enums_1.EstadoDelivery.EN_CAMINO
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(enums_1.EstadoDelivery),
    __metadata("design:type", String)
], UpdateDeliveryDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ description: 'Hora de salida', example: '14:30' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDeliveryDto.prototype, "horaSalida", void 0);
__decorate([
    (0, swagger_2.ApiPropertyOptional)({ description: 'Hora de entrega', example: '15:15' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDeliveryDto.prototype, "horaEntrega", void 0);
//# sourceMappingURL=update-delivery.dto.js.map