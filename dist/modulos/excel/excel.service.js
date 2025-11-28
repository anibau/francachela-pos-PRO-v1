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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ExcelJS = __importStar(require("exceljs"));
const venta_entity_1 = require("../../entities/venta.entity");
const producto_entity_1 = require("../../entities/producto.entity");
const cliente_entity_1 = require("../../entities/cliente.entity");
const movimiento_inventario_entity_1 = require("../../entities/movimiento-inventario.entity");
const delivery_entity_1 = require("../../entities/delivery.entity");
const export_ventas_dto_1 = require("./dto/export-ventas.dto");
let ExcelService = class ExcelService {
    ventaRepository;
    productoRepository;
    clienteRepository;
    movimientoRepository;
    deliveryRepository;
    constructor(ventaRepository, productoRepository, clienteRepository, movimientoRepository, deliveryRepository) {
        this.ventaRepository = ventaRepository;
        this.productoRepository = productoRepository;
        this.clienteRepository = clienteRepository;
        this.movimientoRepository = movimientoRepository;
        this.deliveryRepository = deliveryRepository;
    }
    async exportVentas(exportDto) {
        const workbook = new ExcelJS.Workbook();
        switch (exportDto.tipoReporte || export_ventas_dto_1.TipoReporte.VENTAS) {
            case export_ventas_dto_1.TipoReporte.VENTAS:
                await this.createVentasSheet(workbook, exportDto);
                break;
            case export_ventas_dto_1.TipoReporte.PRODUCTOS:
                await this.createProductosSheet(workbook);
                break;
            case export_ventas_dto_1.TipoReporte.CLIENTES:
                await this.createClientesSheet(workbook);
                break;
            case export_ventas_dto_1.TipoReporte.INVENTARIO:
                await this.createInventarioSheet(workbook, exportDto);
                break;
            case export_ventas_dto_1.TipoReporte.DELIVERY:
                await this.createDeliverySheet(workbook, exportDto);
                break;
        }
        return await workbook.xlsx.writeBuffer();
    }
    async createVentasSheet(workbook, exportDto) {
        const worksheet = workbook.addWorksheet('Ventas');
        const whereCondition = {};
        if (exportDto.fechaInicio && exportDto.fechaFin) {
            whereCondition.fecha = (0, typeorm_2.Between)(new Date(exportDto.fechaInicio), new Date(exportDto.fechaFin));
        }
        const ventas = await this.ventaRepository.find({
            where: whereCondition,
            relations: ['cliente'],
            order: { fecha: 'DESC' }
        });
        const headers = [
            'ID', 'Fecha', 'Cliente', 'DNI Cliente', 'Subtotal', 'Descuento',
            'Total', 'Método Pago', 'Cajero', 'Estado', 'Puntos Otorgados',
            'Puntos Usados', 'Tipo Compra', 'Comentario'
        ];
        if (exportDto.incluirDetalles) {
            headers.push('Productos', 'Cantidades', 'Precios');
        }
        worksheet.addRow(headers);
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6FA' }
        };
        ventas.forEach(venta => {
            const row = [
                venta.id,
                venta.fecha.toLocaleDateString(),
                venta.cliente ? `${venta.cliente.nombres} ${venta.cliente.apellidos}` : 'Sin cliente',
                venta.cliente?.dni || '',
                venta.subTotal,
                venta.descuento,
                venta.total,
                venta.metodoPago,
                venta.cajero,
                venta.estado,
                venta.puntosOtorgados,
                venta.puntosUsados,
                venta.tipoCompra,
                venta.comentario || ''
            ];
            if (exportDto.incluirDetalles && venta.listaProductos) {
                const productos = venta.listaProductos.map((p) => p.descripcion || p.nombre).join(', ');
                const cantidades = venta.listaProductos.map((p) => p.cantidad).join(', ');
                const precios = venta.listaProductos.map((p) => p.precio).join(', ');
                row.push(productos, cantidades, precios);
            }
            worksheet.addRow(row);
        });
        worksheet.columns.forEach(column => {
            column.width = 15;
        });
        const totalRow = worksheet.addRow([
            '', '', '', 'TOTALES:',
            ventas.reduce((sum, v) => sum + v.subTotal, 0),
            ventas.reduce((sum, v) => sum + v.descuento, 0),
            ventas.reduce((sum, v) => sum + v.total, 0),
            '', '', '',
            ventas.reduce((sum, v) => sum + v.puntosOtorgados, 0),
            ventas.reduce((sum, v) => sum + v.puntosUsados, 0)
        ]);
        totalRow.font = { bold: true };
        totalRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFD700' }
        };
    }
    async createProductosSheet(workbook) {
        const worksheet = workbook.addWorksheet('Productos');
        const productos = await this.productoRepository.find({
            order: { productoDescripcion: 'ASC' }
        });
        const headers = [
            'ID', 'Descripción', 'Código Barras', 'Costo', 'Precio', 'Precio Mayoreo',
            'Stock Actual', 'Stock Mínimo', 'Proveedor', 'Categoría', 'Valor Puntos',
            'Mostrar', 'Usa Inventario'
        ];
        worksheet.addRow(headers);
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6FA' }
        };
        productos.forEach(producto => {
            worksheet.addRow([
                producto.id,
                producto.productoDescripcion,
                producto.codigoBarra,
                producto.costo,
                producto.precio,
                producto.precioMayoreo,
                producto.cantidadActual,
                producto.cantidadMinima,
                producto.proveedor,
                producto.categoria,
                producto.valorPuntos,
                producto.mostrar ? 'Sí' : 'No',
                producto.usaInventario ? 'Sí' : 'No'
            ]);
        });
        worksheet.columns.forEach(column => {
            column.width = 15;
        });
    }
    async createClientesSheet(workbook) {
        const worksheet = workbook.addWorksheet('Clientes');
        const clientes = await this.clienteRepository.find({
            order: { fechaRegistro: 'DESC' }
        });
        const headers = [
            'ID', 'Nombres', 'Apellidos', 'DNI', 'Fecha Nacimiento', 'Teléfono',
            'Fecha Registro', 'Puntos Acumulados', 'Código Corto', 'Dirección'
        ];
        worksheet.addRow(headers);
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6FA' }
        };
        clientes.forEach(cliente => {
            worksheet.addRow([
                cliente.id,
                cliente.nombres,
                cliente.apellidos,
                cliente.dni,
                cliente.fechaNacimiento?.toLocaleDateString() || '',
                cliente.telefono,
                cliente.fechaRegistro.toLocaleDateString(),
                cliente.puntosAcumulados,
                cliente.codigoCorto,
                cliente.direccion
            ]);
        });
        worksheet.columns.forEach(column => {
            column.width = 15;
        });
    }
    async createInventarioSheet(workbook, exportDto) {
        const worksheet = workbook.addWorksheet('Movimientos Inventario');
        const whereCondition = {};
        if (exportDto.fechaInicio && exportDto.fechaFin) {
            whereCondition.hora = (0, typeorm_2.Between)(new Date(exportDto.fechaInicio), new Date(exportDto.fechaFin));
        }
        const movimientos = await this.movimientoRepository.find({
            where: whereCondition,
            order: { hora: 'DESC' }
        });
        const headers = [
            'ID', 'Fecha/Hora', 'Código Barras', 'Descripción', 'Tipo', 'Cantidad',
            'Costo', 'Precio Venta', 'Existencia', 'Inv. Mínimo', 'Cajero', 'Proveedor'
        ];
        worksheet.addRow(headers);
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6FA' }
        };
        movimientos.forEach(movimiento => {
            worksheet.addRow([
                movimiento.id,
                movimiento.hora.toLocaleString(),
                movimiento.codigoBarra,
                movimiento.descripcion,
                movimiento.tipo,
                movimiento.cantidad,
                movimiento.costo,
                movimiento.precioVenta,
                movimiento.existencia,
                movimiento.invMinimo,
                movimiento.cajero,
                movimiento.proveedor
            ]);
        });
        worksheet.columns.forEach(column => {
            column.width = 15;
        });
    }
    async createDeliverySheet(workbook, exportDto) {
        const worksheet = workbook.addWorksheet('Delivery');
        const whereCondition = {};
        if (exportDto.fechaInicio && exportDto.fechaFin) {
            whereCondition.fecha = (0, typeorm_2.Between)(new Date(exportDto.fechaInicio), new Date(exportDto.fechaFin));
        }
        const deliveries = await this.deliveryRepository.find({
            where: whereCondition,
            relations: ['cliente'],
            order: { fecha: 'DESC' }
        });
        const headers = [
            'ID', 'Fecha', 'Cliente', 'Teléfono', 'Dirección', 'Estado', 'Repartidor',
            'Hora Salida', 'Hora Entrega', 'Costo Delivery', 'Pedido ID', 'Notas'
        ];
        worksheet.addRow(headers);
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE6E6FA' }
        };
        deliveries.forEach(delivery => {
            worksheet.addRow([
                delivery.id,
                delivery.fecha.toLocaleDateString(),
                delivery.cliente ? `${delivery.cliente.nombres} ${delivery.cliente.apellidos}` : 'Sin cliente',
                delivery.phone,
                delivery.direccion,
                delivery.estado,
                delivery.repartidor,
                delivery.horaSalida,
                delivery.horaEntrega,
                delivery.deliveryFee,
                delivery.pedidoId,
                delivery.notes
            ]);
        });
        worksheet.columns.forEach(column => {
            column.width = 15;
        });
    }
};
exports.ExcelService = ExcelService;
exports.ExcelService = ExcelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(venta_entity_1.Venta)),
    __param(1, (0, typeorm_1.InjectRepository)(producto_entity_1.Producto)),
    __param(2, (0, typeorm_1.InjectRepository)(cliente_entity_1.Cliente)),
    __param(3, (0, typeorm_1.InjectRepository)(movimiento_inventario_entity_1.MovimientoInventario)),
    __param(4, (0, typeorm_1.InjectRepository)(delivery_entity_1.Delivery)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ExcelService);
//# sourceMappingURL=excel.service.js.map