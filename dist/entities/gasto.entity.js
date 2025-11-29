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
exports.Gasto = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../common/enums");
let Gasto = class Gasto {
    id;
    fecha;
    descripcion;
    monto;
    categoria;
    cajero;
    comprobante;
    metodoPago;
    proveedor;
    numeroComprobante;
    fechaCreacion;
    fechaActualizacion;
};
exports.Gasto = Gasto;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Gasto.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Gasto.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Gasto.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Gasto.prototype, "monto", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.CategoriaGasto,
        default: enums_1.CategoriaGasto.OTROS,
    }),
    __metadata("design:type", String)
], Gasto.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Gasto.prototype, "cajero", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Gasto.prototype, "comprobante", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.MetodoPago,
        default: enums_1.MetodoPago.EFECTIVO,
    }),
    __metadata("design:type", String)
], Gasto.prototype, "metodoPago", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Gasto.prototype, "proveedor", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Gasto.prototype, "numeroComprobante", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Gasto.prototype, "fechaCreacion", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Gasto.prototype, "fechaActualizacion", void 0);
exports.Gasto = Gasto = __decorate([
    (0, typeorm_1.Entity)('gastos')
], Gasto);
//# sourceMappingURL=gasto.entity.js.map