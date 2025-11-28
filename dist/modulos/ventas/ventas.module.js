"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ventas_service_1 = require("./ventas.service");
const ventas_controller_1 = require("./ventas.controller");
const venta_entity_1 = require("../../entities/venta.entity");
const cliente_entity_1 = require("../../entities/cliente.entity");
const productos_module_1 = require("../productos/productos.module");
const clientes_module_1 = require("../clientes/clientes.module");
let VentasModule = class VentasModule {
};
exports.VentasModule = VentasModule;
exports.VentasModule = VentasModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([venta_entity_1.Venta, cliente_entity_1.Cliente]),
            productos_module_1.ProductosModule,
            clientes_module_1.ClientesModule,
        ],
        controllers: [ventas_controller_1.VentasController],
        providers: [ventas_service_1.VentasService],
        exports: [ventas_service_1.VentasService],
    })
], VentasModule);
//# sourceMappingURL=ventas.module.js.map