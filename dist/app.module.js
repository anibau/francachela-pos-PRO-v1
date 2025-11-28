"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const database_config_1 = __importDefault(require("./config/database.config"));
const jwt_config_1 = __importDefault(require("./config/jwt.config"));
const entities = __importStar(require("./entities"));
const auth_module_1 = require("./modulos/auth/auth.module");
const users_module_1 = require("./modulos/users/users.module");
const productos_module_1 = require("./modulos/productos/productos.module");
const clientes_module_1 = require("./modulos/clientes/clientes.module");
const ventas_module_1 = require("./modulos/ventas/ventas.module");
const promociones_module_1 = require("./modulos/promociones/promociones.module");
const caja_module_1 = require("./modulos/caja/caja.module");
const gastos_module_1 = require("./modulos/gastos/gastos.module");
const combos_module_1 = require("./modulos/combos/combos.module");
const delivery_module_1 = require("./modulos/delivery/delivery.module");
const movimiento_inventario_module_1 = require("./modulos/movimiento-inventario/movimiento-inventario.module");
const whatsapp_module_1 = require("./modulos/whatsapp/whatsapp.module");
const excel_module_1 = require("./modulos/excel/excel.module");
const seeder_module_1 = require("./database/seeders/seeder.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [database_config_1.default, jwt_config_1.default],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('database.host'),
                    port: configService.get('database.port'),
                    username: configService.get('database.username'),
                    password: configService.get('database.password'),
                    database: configService.get('database.database'),
                    entities: Object.values(entities),
                    synchronize: configService.get('database.synchronize'),
                    logging: configService.get('database.logging'),
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            productos_module_1.ProductosModule,
            clientes_module_1.ClientesModule,
            ventas_module_1.VentasModule,
            promociones_module_1.PromocionesModule,
            caja_module_1.CajaModule,
            gastos_module_1.GastosModule,
            combos_module_1.CombosModule,
            delivery_module_1.DeliveryModule,
            movimiento_inventario_module_1.MovimientoInventarioModule,
            whatsapp_module_1.WhatsappModule,
            excel_module_1.ExcelModule,
            seeder_module_1.SeederModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map