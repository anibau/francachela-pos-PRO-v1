"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const excel_service_1 = require("./excel.service");
const excel_controller_1 = require("./excel.controller");
const venta_entity_1 = require("../../entities/venta.entity");
const producto_entity_1 = require("../../entities/producto.entity");
const cliente_entity_1 = require("../../entities/cliente.entity");
const movimiento_inventario_entity_1 = require("../../entities/movimiento-inventario.entity");
const delivery_entity_1 = require("../../entities/delivery.entity");
let ExcelModule = class ExcelModule {
};
exports.ExcelModule = ExcelModule;
exports.ExcelModule = ExcelModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([
                venta_entity_1.Venta,
                producto_entity_1.Producto,
                cliente_entity_1.Cliente,
                movimiento_inventario_entity_1.MovimientoInventario,
                delivery_entity_1.Delivery
            ])],
        controllers: [excel_controller_1.ExcelController],
        providers: [excel_service_1.ExcelService],
        exports: [excel_service_1.ExcelService],
    })
], ExcelModule);
//# sourceMappingURL=excel.module.js.map