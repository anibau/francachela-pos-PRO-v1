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
exports.Promocion = exports.TipoPromocion = void 0;
const typeorm_1 = require("typeorm");
var TipoPromocion;
(function (TipoPromocion) {
    TipoPromocion["PORCENTAJE"] = "PORCENTAJE";
    TipoPromocion["MONTO"] = "MONTO";
    TipoPromocion["DOS_POR_UNO"] = "2X1";
    TipoPromocion["TRES_POR_DOS"] = "3X2";
})(TipoPromocion || (exports.TipoPromocion = TipoPromocion = {}));
let Promocion = class Promocion {
    id;
    nombre;
    descripcion;
    tipo;
    descuento;
    fechaInicio;
    fechaFin;
    activo;
    productosAplicables;
    montoMinimo;
    cantidadMaximaUsos;
    cantidadUsada;
    fechaCreacion;
    fechaActualizacion;
};
exports.Promocion = Promocion;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Promocion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Promocion.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Promocion.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TipoPromocion,
        default: TipoPromocion.PORCENTAJE,
    }),
    __metadata("design:type", String)
], Promocion.prototype, "tipo", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Promocion.prototype, "descuento", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Promocion.prototype, "fechaInicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Promocion.prototype, "fechaFin", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Promocion.prototype, "activo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], Promocion.prototype, "productosAplicables", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Promocion.prototype, "montoMinimo", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { nullable: true }),
    __metadata("design:type", Number)
], Promocion.prototype, "cantidadMaximaUsos", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    __metadata("design:type", Number)
], Promocion.prototype, "cantidadUsada", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Promocion.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Promocion.prototype, "fechaActualizacion", void 0);
exports.Promocion = Promocion = __decorate([
    (0, typeorm_1.Entity)('promociones')
], Promocion);
//# sourceMappingURL=promocion.entity.js.map