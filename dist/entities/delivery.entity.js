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
exports.Delivery = exports.EstadoDelivery = void 0;
const typeorm_1 = require("typeorm");
const cliente_entity_1 = require("./cliente.entity");
var EstadoDelivery;
(function (EstadoDelivery) {
    EstadoDelivery["PENDIENTE"] = "PENDIENTE";
    EstadoDelivery["EN_PREPARACION"] = "EN_PREPARACION";
    EstadoDelivery["EN_CAMINO"] = "EN_CAMINO";
    EstadoDelivery["ENTREGADO"] = "ENTREGADO";
    EstadoDelivery["CANCELADO"] = "CANCELADO";
})(EstadoDelivery || (exports.EstadoDelivery = EstadoDelivery = {}));
let Delivery = class Delivery {
    id;
    fecha;
    cliente;
    clienteId;
    pedidoId;
    direccion;
    estado;
    repartidor;
    horaSalida;
    horaEntrega;
    saleId;
    phone;
    deliveryFee;
    notes;
    coordenadas;
    tiempoEstimado;
    fechaCreacion;
    fechaActualizacion;
};
exports.Delivery = Delivery;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Delivery.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Delivery.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cliente_entity_1.Cliente, { nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'clienteId' }),
    __metadata("design:type", cliente_entity_1.Cliente)
], Delivery.prototype, "cliente", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Delivery.prototype, "clienteId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Delivery.prototype, "pedidoId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Delivery.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoDelivery,
        default: EstadoDelivery.PENDIENTE,
    }),
    __metadata("design:type", String)
], Delivery.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Delivery.prototype, "repartidor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Delivery.prototype, "horaSalida", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Delivery.prototype, "horaEntrega", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Delivery.prototype, "saleId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Delivery.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Delivery.prototype, "deliveryFee", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Delivery.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Delivery.prototype, "coordenadas", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Delivery.prototype, "tiempoEstimado", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Delivery.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Delivery.prototype, "fechaActualizacion", void 0);
exports.Delivery = Delivery = __decorate([
    (0, typeorm_1.Entity)('delivery')
], Delivery);
//# sourceMappingURL=delivery.entity.js.map