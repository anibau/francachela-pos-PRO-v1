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
exports.MovimientoInventario = exports.TipoMovimiento = void 0;
const typeorm_1 = require("typeorm");
var TipoMovimiento;
(function (TipoMovimiento) {
    TipoMovimiento["ENTRADA"] = "ENTRADA";
    TipoMovimiento["SALIDA"] = "SALIDA";
    TipoMovimiento["AJUSTE"] = "AJUSTE";
    TipoMovimiento["VENTA"] = "VENTA";
    TipoMovimiento["DEVOLUCION"] = "DEVOLUCION";
})(TipoMovimiento || (exports.TipoMovimiento = TipoMovimiento = {}));
let MovimientoInventario = class MovimientoInventario {
    id;
    hora;
    codigoBarra;
    descripcion;
    costo;
    precioVenta;
    existenciaAnterior;
    existenciaNueva;
    invMinimo;
    tipo;
    cantidad;
    cajero;
    proveedor;
    numeroFactura;
    observaciones;
    ventaId;
    fechaCreacion;
    fechaActualizacion;
};
exports.MovimientoInventario = MovimientoInventario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], MovimientoInventario.prototype, "hora", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MovimientoInventario.prototype, "codigoBarra", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MovimientoInventario.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "costo", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "precioVenta", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "existenciaAnterior", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "existenciaNueva", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "invMinimo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoMovimiento,
        default: TipoMovimiento.AJUSTE,
    }),
    __metadata("design:type", String)
], MovimientoInventario.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "cantidad", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MovimientoInventario.prototype, "cajero", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MovimientoInventario.prototype, "proveedor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MovimientoInventario.prototype, "numeroFactura", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MovimientoInventario.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], MovimientoInventario.prototype, "ventaId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MovimientoInventario.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MovimientoInventario.prototype, "fechaActualizacion", void 0);
exports.MovimientoInventario = MovimientoInventario = __decorate([
    (0, typeorm_1.Entity)('movimientos_inventario')
], MovimientoInventario);
//# sourceMappingURL=movimiento-inventario.entity.js.map