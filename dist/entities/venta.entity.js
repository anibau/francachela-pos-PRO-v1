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
exports.Venta = exports.MetodoPago = exports.TipoCompra = exports.EstadoVenta = void 0;
const typeorm_1 = require("typeorm");
const cliente_entity_1 = require("./cliente.entity");
var EstadoVenta;
(function (EstadoVenta) {
    EstadoVenta["COMPLETADO"] = "COMPLETADO";
    EstadoVenta["ANULADO"] = "ANULADO";
    EstadoVenta["PENDIENTE"] = "PENDIENTE";
})(EstadoVenta || (exports.EstadoVenta = EstadoVenta = {}));
var TipoCompra;
(function (TipoCompra) {
    TipoCompra["LOCAL"] = "LOCAL";
    TipoCompra["DELIVERY"] = "DELIVERY";
})(TipoCompra || (exports.TipoCompra = TipoCompra = {}));
var MetodoPago;
(function (MetodoPago) {
    MetodoPago["EFECTIVO"] = "EFECTIVO";
    MetodoPago["YAPE"] = "YAPE";
    MetodoPago["PLIN"] = "PLIN";
    MetodoPago["TARJETA"] = "TARJETA";
    MetodoPago["TRANSFERENCIA"] = "TRANSFERENCIA";
})(MetodoPago || (exports.MetodoPago = MetodoPago = {}));
let Venta = class Venta {
    id;
    fecha;
    cliente;
    clienteId;
    listaProductos;
    subTotal;
    descuento;
    total;
    metodoPago;
    comentario;
    cajero;
    estado;
    puntosOtorgados;
    puntosUsados;
    ticketId;
    tipoCompra;
    montoRecibido;
    vuelto;
    fechaCreacion;
    fechaActualizacion;
};
exports.Venta = Venta;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Venta.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Venta.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => cliente_entity_1.Cliente, { nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'clienteId' }),
    __metadata("design:type", cliente_entity_1.Cliente)
], Venta.prototype, "cliente", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Venta.prototype, "clienteId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Array)
], Venta.prototype, "listaProductos", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Venta.prototype, "subTotal", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Venta.prototype, "descuento", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Venta.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MetodoPago,
        default: MetodoPago.EFECTIVO,
    }),
    __metadata("design:type", String)
], Venta.prototype, "metodoPago", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Venta.prototype, "comentario", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Venta.prototype, "cajero", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoVenta,
        default: EstadoVenta.COMPLETADO,
    }),
    __metadata("design:type", String)
], Venta.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    __metadata("design:type", Number)
], Venta.prototype, "puntosOtorgados", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    __metadata("design:type", Number)
], Venta.prototype, "puntosUsados", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Venta.prototype, "ticketId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoCompra,
        default: TipoCompra.LOCAL,
    }),
    __metadata("design:type", String)
], Venta.prototype, "tipoCompra", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Venta.prototype, "montoRecibido", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Venta.prototype, "vuelto", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Venta.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Venta.prototype, "fechaActualizacion", void 0);
exports.Venta = Venta = __decorate([
    (0, typeorm_1.Entity)('ventas')
], Venta);
//# sourceMappingURL=venta.entity.js.map