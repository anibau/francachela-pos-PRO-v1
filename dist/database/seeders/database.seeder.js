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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var DatabaseSeeder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseSeeder = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
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
const enums_1 = require("../../common/enums");
let DatabaseSeeder = DatabaseSeeder_1 = class DatabaseSeeder {
    usuarioRepository;
    productoRepository;
    clienteRepository;
    promocionRepository;
    comboRepository;
    ventaRepository;
    cajaRepository;
    gastoRepository;
    deliveryRepository;
    movimientoRepository;
    logger = new common_1.Logger(DatabaseSeeder_1.name);
    constructor(usuarioRepository, productoRepository, clienteRepository, promocionRepository, comboRepository, ventaRepository, cajaRepository, gastoRepository, deliveryRepository, movimientoRepository) {
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
        this.clienteRepository = clienteRepository;
        this.promocionRepository = promocionRepository;
        this.comboRepository = comboRepository;
        this.ventaRepository = ventaRepository;
        this.cajaRepository = cajaRepository;
        this.gastoRepository = gastoRepository;
        this.deliveryRepository = deliveryRepository;
        this.movimientoRepository = movimientoRepository;
    }
    async seed() {
        this.logger.log('🌱 Iniciando población de base de datos...');
        try {
            await this.seedUsuarios();
            await this.seedProductos();
            await this.seedClientes();
            await this.seedPromociones();
            await this.seedCombos();
            await this.seedCajas();
            await this.seedGastos();
            await this.seedVentas();
            await this.seedDeliveries();
            await this.seedMovimientosInventario();
            this.logger.log('✅ Base de datos poblada exitosamente');
        }
        catch (error) {
            this.logger.error('❌ Error poblando base de datos:', error);
            throw error;
        }
    }
    async seedUsuarios() {
        this.logger.log('👥 Creando usuarios...');
        const usuarios = [
            {
                username: 'admin',
                password: await bcrypt.hash('admin123', 10),
                rol: enums_1.UserRole.ADMIN,
                nombre: 'Administrador Principal'
            },
            {
                username: 'cajero1',
                password: await bcrypt.hash('cajero123', 10),
                rol: enums_1.UserRole.CAJERO,
                nombre: 'María González'
            },
            {
                username: 'cajero2',
                password: await bcrypt.hash('cajero123', 10),
                rol: enums_1.UserRole.CAJERO,
                nombre: 'Carlos Rodríguez'
            },
            {
                username: 'inventarios',
                password: await bcrypt.hash('inv123', 10),
                rol: enums_1.UserRole.INVENTARIOS,
                nombre: 'Ana Martínez'
            },
            {
                username: 'supervisor',
                password: await bcrypt.hash('super123', 10),
                rol: enums_1.UserRole.ADMIN,
                nombre: 'Luis Supervisor'
            }
        ];
        for (const userData of usuarios) {
            const existingUser = await this.usuarioRepository.findOne({
                where: { username: userData.username }
            });
            if (!existingUser) {
                await this.usuarioRepository.save(userData);
            }
        }
    }
    async seedProductos() {
        this.logger.log('🍺 Creando productos...');
        const productos = [
            {
                productoDescripcion: 'Cerveza Pilsen 650ml',
                codigoBarra: '7751271001234',
                costo: 3.50,
                precio: 6.00,
                precioMayoreo: 5.50,
                cantidadActual: 100,
                cantidadMinima: 20,
                proveedor: 'Backus',
                categoria: 'Cervezas',
                valorPuntos: 6,
                mostrar: true,
                usaInventario: true
            },
            {
                productoDescripcion: 'Cerveza Cristal 630ml',
                codigoBarra: '7751271001235',
                costo: 3.20,
                precio: 5.50,
                precioMayoreo: 5.00,
                cantidadActual: 80,
                cantidadMinima: 15,
                proveedor: 'Backus',
                categoria: 'Cervezas',
                valorPuntos: 5,
                mostrar: true,
                usaInventario: true
            },
            {
                productoDescripcion: 'Pisco Quebranta 750ml',
                codigoBarra: '7751271001236',
                costo: 25.00,
                precio: 45.00,
                precioMayoreo: 40.00,
                cantidadActual: 30,
                cantidadMinima: 5,
                proveedor: 'Viñas Peruanas',
                categoria: 'Licores',
                valorPuntos: 45,
                mostrar: true,
                usaInventario: true
            },
            {
                productoDescripcion: 'Chicharrón Preparado',
                codigoBarra: '7751271001237',
                costo: 8.00,
                precio: 15.00,
                precioMayoreo: 13.00,
                cantidadActual: 50,
                cantidadMinima: 10,
                proveedor: 'Cocina Local',
                categoria: 'Comida',
                valorPuntos: 15,
                mostrar: true,
                usaInventario: true
            },
            {
                productoDescripcion: 'Agua Mineral 500ml',
                codigoBarra: '7751271001238',
                costo: 0.80,
                precio: 2.00,
                precioMayoreo: 1.50,
                cantidadActual: 200,
                cantidadMinima: 50,
                proveedor: 'San Luis',
                categoria: 'Bebidas',
                valorPuntos: 2,
                mostrar: true,
                usaInventario: true
            }
        ];
        for (const productoData of productos) {
            const existingProduct = await this.productoRepository.findOne({
                where: { codigoBarra: productoData.codigoBarra }
            });
            if (!existingProduct) {
                await this.productoRepository.save(productoData);
            }
        }
    }
    async seedClientes() {
        this.logger.log('👤 Creando clientes...');
        const clientes = [
            {
                nombres: 'Juan Carlos',
                apellidos: 'Pérez García',
                dni: '12345678',
                fechaNacimiento: new Date('1985-03-15'),
                telefono: '987654321',
                puntosAcumulados: 150,
                codigoCorto: 'JCP001',
                direccion: 'Av. Los Olivos 123, Lima'
            },
            {
                nombres: 'María Elena',
                apellidos: 'Rodríguez López',
                dni: '87654321',
                fechaNacimiento: new Date('1990-07-22'),
                telefono: '912345678',
                puntosAcumulados: 89,
                codigoCorto: 'MER002',
                direccion: 'Jr. Las Flores 456, Lima'
            },
            {
                nombres: 'Carlos Alberto',
                apellidos: 'Mendoza Silva',
                dni: '11223344',
                fechaNacimiento: new Date('1978-11-08'),
                telefono: '998877665',
                puntosAcumulados: 234,
                codigoCorto: 'CAM003',
                direccion: 'Calle Los Pinos 789, Lima'
            },
            {
                nombres: 'Ana Sofía',
                apellidos: 'Torres Vega',
                dni: '44332211',
                fechaNacimiento: new Date('1995-01-30'),
                telefono: '955443322',
                puntosAcumulados: 67,
                codigoCorto: 'AST004',
                direccion: 'Av. Central 321, Lima'
            },
            {
                nombres: 'Roberto',
                apellidos: 'Castillo Morales',
                dni: '55667788',
                fechaNacimiento: new Date('1982-09-14'),
                telefono: '977889900',
                puntosAcumulados: 178,
                codigoCorto: 'RCM005',
                direccion: 'Jr. Independencia 654, Lima'
            }
        ];
        for (const clienteData of clientes) {
            const existingClient = await this.clienteRepository.findOne({
                where: { dni: clienteData.dni }
            });
            if (!existingClient) {
                await this.clienteRepository.save(clienteData);
            }
        }
    }
    async seedPromociones() {
        this.logger.log('🎁 Creando promociones...');
        const promociones = [
            {
                nombre: 'Descuento Fin de Semana',
                descripcion: '10% de descuento en todas las cervezas',
                tipo: enums_1.TipoPromocion.PORCENTAJE,
                descuento: 10,
                fechaInicio: new Date('2024-01-01'),
                fechaFin: new Date('2024-12-31'),
                activo: true
            },
            {
                nombre: 'Happy Hour',
                descripcion: 'S/5 de descuento en licores',
                tipo: enums_1.TipoPromocion.MONTO,
                descuento: 5,
                fechaInicio: new Date('2024-01-01'),
                fechaFin: new Date('2024-12-31'),
                activo: true
            },
            {
                nombre: 'Promo Estudiantes',
                descripcion: '15% descuento con carnet universitario',
                tipo: enums_1.TipoPromocion.PORCENTAJE,
                descuento: 15,
                fechaInicio: new Date('2024-03-01'),
                fechaFin: new Date('2024-07-31'),
                activo: true
            },
            {
                nombre: 'Descuento Cumpleañeros',
                descripcion: 'S/10 de descuento en tu cumpleaños',
                tipo: enums_1.TipoPromocion.MONTO,
                descuento: 10,
                fechaInicio: new Date('2024-01-01'),
                fechaFin: new Date('2024-12-31'),
                activo: true
            },
            {
                nombre: 'Black Friday',
                descripcion: '25% descuento en todo',
                tipo: enums_1.TipoPromocion.PORCENTAJE,
                descuento: 25,
                fechaInicio: new Date('2024-11-29'),
                fechaFin: new Date('2024-11-29'),
                activo: false
            }
        ];
        for (const promocionData of promociones) {
            const existingPromo = await this.promocionRepository.findOne({
                where: { nombre: promocionData.nombre }
            });
            if (!existingPromo) {
                await this.promocionRepository.save(promocionData);
            }
        }
    }
    async seedCombos() {
        this.logger.log('🎁 Creando combos...');
        const combos = [
            {
                nombre: 'Combo Cervecero',
                descripcion: '2 Cervezas + Chicharrón',
                productos: [
                    { id: 1, cantidad: 2 },
                    { id: 4, cantidad: 1 }
                ],
                precioOriginal: 27.00,
                precioCombo: 22.00,
                puntosExtra: 5,
                active: true
            },
            {
                nombre: 'Pack Fin de Semana',
                descripcion: '3 Cervezas Pilsen + Agua',
                productos: [
                    { id: 1, cantidad: 3 },
                    { id: 5, cantidad: 1 }
                ],
                precioOriginal: 20.00,
                precioCombo: 17.00,
                puntosExtra: 3,
                active: true
            },
            {
                nombre: 'Combo Premium',
                descripcion: 'Pisco + 2 Cervezas + Chicharrón',
                productos: [
                    { id: 3, cantidad: 1 },
                    { id: 1, cantidad: 2 },
                    { id: 4, cantidad: 1 }
                ],
                precioOriginal: 72.00,
                precioCombo: 65.00,
                puntosExtra: 10,
                active: true
            },
            {
                nombre: 'Combo Económico',
                descripcion: '2 Cristal + Agua',
                productos: [
                    { id: 2, cantidad: 2 },
                    { id: 5, cantidad: 1 }
                ],
                precioOriginal: 13.00,
                precioCombo: 11.00,
                puntosExtra: 2,
                active: true
            },
            {
                nombre: 'Mega Combo',
                descripcion: '4 Cervezas variadas + 2 Chicharrones',
                productos: [
                    { id: 1, cantidad: 2 },
                    { id: 2, cantidad: 2 },
                    { id: 4, cantidad: 2 }
                ],
                precioOriginal: 53.00,
                precioCombo: 45.00,
                puntosExtra: 8,
                active: true
            }
        ];
        for (const comboData of combos) {
            const existingCombo = await this.comboRepository.findOne({
                where: { nombre: comboData.nombre }
            });
            if (!existingCombo) {
                await this.comboRepository.save(comboData);
            }
        }
    }
    async seedCajas() {
        this.logger.log('💰 Creando cajas...');
        const cajas = [
            {
                fechaApertura: new Date('2024-01-15 08:00:00'),
                fechaCierre: new Date('2024-01-15 20:00:00'),
                montoInicial: 100.00,
                totalVentas: 450.00,
                totalGastos: 50.00,
                montoFinal: 500.00,
                cajero: 'María González',
                estado: enums_1.EstadoCaja.CERRADA,
                diferencia: 0.00
            },
            {
                fechaApertura: new Date('2024-01-16 08:00:00'),
                fechaCierre: new Date('2024-01-16 20:00:00'),
                montoInicial: 100.00,
                totalVentas: 380.00,
                totalGastos: 30.00,
                montoFinal: 450.00,
                cajero: 'Carlos Rodríguez',
                estado: enums_1.EstadoCaja.CERRADA,
                diferencia: 0.00
            },
            {
                fechaApertura: new Date('2024-01-17 08:00:00'),
                fechaCierre: new Date('2024-01-17 20:00:00'),
                montoInicial: 100.00,
                totalVentas: 520.00,
                totalGastos: 40.00,
                montoFinal: 580.00,
                cajero: 'María González',
                estado: enums_1.EstadoCaja.CERRADA,
                diferencia: 0.00
            },
            {
                fechaApertura: new Date('2024-01-18 08:00:00'),
                fechaCierre: new Date('2024-01-18 20:00:00'),
                montoInicial: 100.00,
                totalVentas: 290.00,
                totalGastos: 25.00,
                montoFinal: 365.00,
                cajero: 'Carlos Rodríguez',
                estado: enums_1.EstadoCaja.CERRADA,
                diferencia: 0.00
            },
            {
                fechaApertura: new Date('2024-01-19 08:00:00'),
                fechaCierre: undefined,
                montoInicial: 100.00,
                totalVentas: 150.00,
                totalGastos: 15.00,
                montoFinal: 0.00,
                cajero: 'María González',
                estado: enums_1.EstadoCaja.ABIERTA,
                diferencia: 0.00
            }
        ];
        for (const cajaData of cajas) {
            await this.cajaRepository.save(cajaData);
        }
    }
    async seedGastos() {
        this.logger.log('💸 Creando gastos...');
        const gastos = [
            {
                fecha: new Date('2024-01-15 10:30:00'),
                descripcion: 'Compra de servilletas y vasos',
                monto: 25.00,
                categoria: enums_1.CategoriaGasto.OPERATIVO,
                cajero: 'María González',
                metodoPago: enums_1.MetodoPago.EFECTIVO
            },
            {
                fecha: new Date('2024-01-15 14:15:00'),
                descripcion: 'Pago de luz',
                monto: 80.00,
                categoria: enums_1.CategoriaGasto.SERVICIOS,
                cajero: 'María González',
                metodoPago: enums_1.MetodoPago.TARJETA
            },
            {
                fecha: new Date('2024-01-16 09:45:00'),
                descripcion: 'Limpieza y mantenimiento',
                monto: 45.00,
                categoria: enums_1.CategoriaGasto.MANTENIMIENTO,
                cajero: 'Carlos Rodríguez',
                metodoPago: enums_1.MetodoPago.EFECTIVO
            },
            {
                fecha: new Date('2024-01-17 11:20:00'),
                descripcion: 'Compra de hielo',
                monto: 15.00,
                categoria: enums_1.CategoriaGasto.OPERATIVO,
                cajero: 'María González',
                metodoPago: enums_1.MetodoPago.EFECTIVO
            },
            {
                fecha: new Date('2024-01-18 16:30:00'),
                descripcion: 'Reparación de refrigeradora',
                monto: 120.00,
                categoria: enums_1.CategoriaGasto.MANTENIMIENTO,
                cajero: 'Carlos Rodríguez',
                metodoPago: enums_1.MetodoPago.TARJETA
            }
        ];
        for (const gastoData of gastos) {
            const gasto = this.gastoRepository.create(gastoData);
            await this.gastoRepository.save(gasto);
        }
    }
    async seedVentas() {
        this.logger.log('🛒 Creando ventas...');
        const clientes = await this.clienteRepository.find();
        const ventas = [
            {
                fecha: new Date('2024-01-15 12:30:00'),
                clienteId: clientes[0]?.id,
                listaProductos: [
                    { id: 1, cantidad: 2, precio: 6.00, subtotal: 12.00, descripcion: 'Cerveza Pilsen 650ml' },
                    { id: 4, cantidad: 1, precio: 15.00, subtotal: 15.00, descripcion: 'Chicharrón Preparado' }
                ],
                subTotal: 27.00,
                descuento: 2.70,
                total: 24.30,
                metodoPago: enums_1.MetodoPago.EFECTIVO,
                cajero: 'María González',
                estado: enums_1.EstadoVenta.COMPLETADO,
                puntosOtorgados: 24,
                puntosUsados: 0,
                tipoCompra: enums_1.TipoCompra.LOCAL,
                comentario: 'Cliente frecuente'
            },
            {
                fecha: new Date('2024-01-15 15:45:00'),
                clienteId: clientes[1]?.id,
                listaProductos: [
                    { id: 2, cantidad: 3, precio: 5.50, subtotal: 16.50, descripcion: 'Cerveza Cristal 630ml' }
                ],
                subTotal: 16.50,
                descuento: 0.00,
                total: 16.50,
                metodoPago: enums_1.MetodoPago.YAPE,
                cajero: 'María González',
                estado: enums_1.EstadoVenta.COMPLETADO,
                puntosOtorgados: 16,
                puntosUsados: 0,
                tipoCompra: enums_1.TipoCompra.LOCAL
            },
            {
                fecha: new Date('2024-01-16 14:20:00'),
                clienteId: clientes[2]?.id,
                listaProductos: [
                    { id: 3, cantidad: 1, precio: 45.00, subtotal: 45.00, descripcion: 'Pisco Quebranta 750ml' },
                    { id: 5, cantidad: 2, precio: 2.00, subtotal: 4.00, descripcion: 'Agua Mineral 500ml' }
                ],
                subTotal: 49.00,
                descuento: 0.00,
                total: 49.00,
                metodoPago: enums_1.MetodoPago.TARJETA,
                cajero: 'Carlos Rodríguez',
                estado: enums_1.EstadoVenta.COMPLETADO,
                puntosOtorgados: 49,
                puntosUsados: 0,
                tipoCompra: enums_1.TipoCompra.DELIVERY
            },
            {
                fecha: new Date('2024-01-17 18:10:00'),
                clienteId: clientes[3]?.id,
                listaProductos: [
                    { id: 1, cantidad: 1, precio: 6.00, subtotal: 6.00, descripcion: 'Cerveza Pilsen 650ml' },
                    { id: 2, cantidad: 1, precio: 5.50, subtotal: 5.50, descripcion: 'Cerveza Cristal 630ml' }
                ],
                subTotal: 11.50,
                descuento: 1.15,
                total: 10.35,
                metodoPago: enums_1.MetodoPago.PLIN,
                cajero: 'María González',
                estado: enums_1.EstadoVenta.COMPLETADO,
                puntosOtorgados: 10,
                puntosUsados: 5,
                tipoCompra: enums_1.TipoCompra.LOCAL
            },
            {
                fecha: new Date('2024-01-18 20:30:00'),
                clienteId: clientes[4]?.id,
                listaProductos: [
                    { id: 4, cantidad: 2, precio: 15.00, subtotal: 30.00, descripcion: 'Chicharrón Preparado' },
                    { id: 5, cantidad: 4, precio: 2.00, subtotal: 8.00, descripcion: 'Agua Mineral 500ml' }
                ],
                subTotal: 38.00,
                descuento: 0.00,
                total: 38.00,
                metodoPago: enums_1.MetodoPago.EFECTIVO,
                cajero: 'Carlos Rodríguez',
                estado: enums_1.EstadoVenta.COMPLETADO,
                puntosOtorgados: 38,
                puntosUsados: 0,
                tipoCompra: enums_1.TipoCompra.LOCAL,
                comentario: 'Pedido para llevar'
            }
        ];
        for (const ventaData of ventas) {
            const venta = this.ventaRepository.create(ventaData);
            await this.ventaRepository.save(venta);
        }
    }
    async seedDeliveries() {
        this.logger.log('🚚 Creando deliveries...');
        const clientes = await this.clienteRepository.find();
        const deliveries = [
            {
                fecha: new Date('2024-01-15 19:00:00'),
                cliente: clientes[0],
                pedidoId: 1,
                direccion: 'Av. Los Olivos 123, Lima',
                estado: enums_1.EstadoDelivery.ENTREGADO,
                repartidor: 'Miguel Delivery',
                horaSalida: '19:15',
                horaEntrega: '19:45',
                saleId: 1,
                phone: '987654321',
                deliveryFee: 5.00,
                notes: 'Entregar en portería'
            },
            {
                fecha: new Date('2024-01-16 20:30:00'),
                cliente: clientes[2],
                pedidoId: 3,
                direccion: 'Calle Los Pinos 789, Lima',
                estado: enums_1.EstadoDelivery.ENTREGADO,
                repartidor: 'Carlos Delivery',
                horaSalida: '20:45',
                horaEntrega: '21:20',
                saleId: 3,
                phone: '998877665',
                deliveryFee: 7.00,
                notes: 'Casa color azul'
            },
            {
                fecha: new Date('2024-01-17 18:00:00'),
                cliente: clientes[1],
                pedidoId: 2,
                direccion: 'Jr. Las Flores 456, Lima',
                estado: enums_1.EstadoDelivery.EN_CAMINO,
                repartidor: 'Miguel Delivery',
                horaSalida: '18:15',
                horaEntrega: undefined,
                saleId: 2,
                phone: '912345678',
                deliveryFee: 4.00,
                notes: 'Llamar al llegar'
            },
            {
                fecha: new Date('2024-01-18 19:30:00'),
                cliente: clientes[3],
                pedidoId: 4,
                direccion: 'Av. Central 321, Lima',
                estado: enums_1.EstadoDelivery.ASIGNADO,
                repartidor: 'Carlos Delivery',
                horaSalida: undefined,
                horaEntrega: undefined,
                saleId: 4,
                phone: '955443322',
                deliveryFee: 6.00
            },
            {
                fecha: new Date('2024-01-19 17:45:00'),
                cliente: clientes[4],
                pedidoId: 5,
                direccion: 'Jr. Independencia 654, Lima',
                estado: enums_1.EstadoDelivery.PENDIENTE,
                repartidor: '',
                horaSalida: undefined,
                horaEntrega: undefined,
                saleId: 5,
                phone: '977889900',
                deliveryFee: 5.50,
                notes: 'Pedido urgente'
            }
        ];
        for (const deliveryData of deliveries) {
            await this.deliveryRepository.save(deliveryData);
        }
    }
    async seedMovimientosInventario() {
        this.logger.log('📦 Creando movimientos de inventario...');
        const movimientos = [
            {
                hora: new Date('2024-01-15 08:30:00'),
                codigoBarra: '7751271001234',
                descripcion: 'Cerveza Pilsen 650ml',
                costo: 3.50,
                precioVenta: 6.00,
                existencia: 120,
                invMinimo: 20,
                tipo: enums_1.TipoMovimiento.ENTRADA,
                cantidad: 50,
                cajero: 'Ana Martínez',
                proveedor: 'Backus'
            },
            {
                hora: new Date('2024-01-15 12:30:00'),
                codigoBarra: '7751271001234',
                descripcion: 'Cerveza Pilsen 650ml',
                costo: 3.50,
                precioVenta: 6.00,
                existencia: 118,
                invMinimo: 20,
                tipo: enums_1.TipoMovimiento.SALIDA,
                cantidad: 2,
                cajero: 'María González'
            },
            {
                hora: new Date('2024-01-16 09:15:00'),
                codigoBarra: '7751271001235',
                descripcion: 'Cerveza Cristal 630ml',
                costo: 3.20,
                precioVenta: 5.50,
                existencia: 100,
                invMinimo: 15,
                tipo: enums_1.TipoMovimiento.ENTRADA,
                cantidad: 40,
                cajero: 'Ana Martínez',
                proveedor: 'Backus'
            },
            {
                hora: new Date('2024-01-17 14:00:00'),
                codigoBarra: '7751271001236',
                descripcion: 'Pisco Quebranta 750ml',
                costo: 25.00,
                precioVenta: 45.00,
                existencia: 30,
                invMinimo: 5,
                tipo: enums_1.TipoMovimiento.AJUSTE,
                cantidad: 30,
                cajero: 'Ana Martínez'
            },
            {
                hora: new Date('2024-01-18 16:45:00'),
                codigoBarra: '7751271001238',
                descripcion: 'Agua Mineral 500ml',
                costo: 0.80,
                precioVenta: 2.00,
                existencia: 250,
                invMinimo: 50,
                tipo: enums_1.TipoMovimiento.ENTRADA,
                cantidad: 100,
                cajero: 'Ana Martínez',
                proveedor: 'San Luis'
            }
        ];
        for (const movimientoData of movimientos) {
            await this.movimientoRepository.save(movimientoData);
        }
    }
};
exports.DatabaseSeeder = DatabaseSeeder;
exports.DatabaseSeeder = DatabaseSeeder = DatabaseSeeder_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __param(1, (0, typeorm_1.InjectRepository)(producto_entity_1.Producto)),
    __param(2, (0, typeorm_1.InjectRepository)(cliente_entity_1.Cliente)),
    __param(3, (0, typeorm_1.InjectRepository)(promocion_entity_1.Promocion)),
    __param(4, (0, typeorm_1.InjectRepository)(combo_entity_1.Combo)),
    __param(5, (0, typeorm_1.InjectRepository)(venta_entity_1.Venta)),
    __param(6, (0, typeorm_1.InjectRepository)(caja_entity_1.Caja)),
    __param(7, (0, typeorm_1.InjectRepository)(gasto_entity_1.Gasto)),
    __param(8, (0, typeorm_1.InjectRepository)(delivery_entity_1.Delivery)),
    __param(9, (0, typeorm_1.InjectRepository)(movimiento_inventario_entity_1.MovimientoInventario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], DatabaseSeeder);
//# sourceMappingURL=database.seeder.js.map