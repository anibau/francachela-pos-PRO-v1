"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const database_seeder_1 = require("./database.seeder");
const usuario_entity_1 = require("../../entities/usuario.entity");
const producto_entity_1 = require("../../entities/producto.entity");
const cliente_entity_1 = require("../../entities/cliente.entity");
const promocion_entity_1 = require("../../entities/promocion.entity");
const combo_entity_1 = require("../../entities/combo.entity");
const venta_entity_1 = require("../../entities/venta.entity");
const caja_entity_1 = require("../../entities/caja.entity");
const gasto_entity_1 = require("../../entities/gasto.entity");
const delivery_entity_1 = require("../../entities/delivery.entity");
const movimiento_inventario_entity_1 = require("../../entities/movimiento-inventario.entity");
let SeederModule = class SeederModule {
};
exports.SeederModule = SeederModule;
exports.SeederModule = SeederModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                usuario_entity_1.Usuario,
                producto_entity_1.Producto,
                cliente_entity_1.Cliente,
                promocion_entity_1.Promocion,
                combo_entity_1.Combo,
                venta_entity_1.Venta,
                caja_entity_1.Caja,
                gasto_entity_1.Gasto,
                delivery_entity_1.Delivery,
                movimiento_inventario_entity_1.MovimientoInventario,
            ]),
        ],
        providers: [database_seeder_1.DatabaseSeeder],
        exports: [database_seeder_1.DatabaseSeeder],
    })
], SeederModule);
//# sourceMappingURL=seeder.module.js.map