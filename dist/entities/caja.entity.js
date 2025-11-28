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
exports.Caja = exports.EstadoCaja = void 0;
const typeorm_1 = require("typeorm");
var EstadoCaja;
(function (EstadoCaja) {
    EstadoCaja["ABIERTA"] = "ABIERTA";
    EstadoCaja["CERRADA"] = "CERRADA";
})(EstadoCaja || (exports.EstadoCaja = EstadoCaja = {}));
let Caja = class Caja {
    id;
    fechaApertura;
    fechaCierre;
    montoInicial;
    totalVentas;
    totalGastos;
    montoFinal;
    cajero;
    estado;
    diferencia;
    desglosePorMetodo;
    observaciones;
    fechaCreacion;
    fechaActualizacion;
    get montoEsperado() {
        return this.montoInicial + this.totalVentas - this.totalGastos;
    }
};
exports.Caja = Caja;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Caja.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Caja.prototype, "fechaApertura", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Caja.prototype, "fechaCierre", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Caja.prototype, "montoInicial", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Caja.prototype, "totalVentas", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Caja.prototype, "totalGastos", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Caja.prototype, "montoFinal", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Caja.prototype, "cajero", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EstadoCaja,
        default: EstadoCaja.ABIERTA,
    }),
    __metadata("design:type", String)
], Caja.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Caja.prototype, "diferencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: {} }),
    __metadata("design:type", Object)
], Caja.prototype, "desglosePorMetodo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Caja.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Caja.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Caja.prototype, "fechaActualizacion", void 0);
exports.Caja = Caja = __decorate([
    (0, typeorm_1.Entity)('caja')
], Caja);
//# sourceMappingURL=caja.entity.js.map