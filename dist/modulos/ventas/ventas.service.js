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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VentasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const venta_entity_1 = require("../../entities/venta.entity");
const cliente_entity_1 = require("../../entities/cliente.entity");
const productos_service_1 = require("../productos/productos.service");
const clientes_service_1 = require("../clientes/clientes.service");
let VentasService = class VentasService {
    ventaRepository;
    clienteRepository;
    productosService;
    clientesService;
    constructor(ventaRepository, clienteRepository, productosService, clientesService) {
        this.ventaRepository = ventaRepository;
        this.clienteRepository = clienteRepository;
        this.productosService = productosService;
        this.clientesService = clientesService;
    }
    async create(createVentaDto, cajero) {
        const { clienteId, listaProductos, puntosUsados } = createVentaDto;
        let cliente = null;
        if (clienteId) {
            cliente = await this.clientesService.findById(clienteId);
            if (puntosUsados > 0 && cliente.puntosAcumulados < puntosUsados) {
                throw new common_1.BadRequestException('El cliente no tiene suficientes puntos');
            }
        }
        let subTotal = 0;
        const productosValidados = [];
        for (const item of listaProductos) {
            const producto = await this.productosService.findById(item.productoId);
            if (producto.usaInventario && producto.cantidadActual < item.cantidad) {
                throw new common_1.BadRequestException(`Stock insuficiente para ${producto.productoDescripcion}`);
            }
            const precio = item.precioUnitario || producto.precio;
            const subtotalItem = precio * item.cantidad;
            productosValidados.push({
                productoId: producto.id,
                codigoBarra: producto.codigoBarra,
                descripcion: producto.productoDescripcion,
                cantidad: item.cantidad,
                precioUnitario: precio,
                subtotal: subtotalItem,
                valorPuntos: producto.valorPuntos,
            });
            subTotal += subtotalItem;
        }
        const descuentoPorPuntos = puntosUsados * 0.10;
        const descuentoTotal = (createVentaDto.descuento || 0) + descuentoPorPuntos;
        const total = subTotal - descuentoTotal;
        if (total < 0) {
            throw new common_1.BadRequestException('El total no puede ser negativo');
        }
        const puntosOtorgados = clienteId ? Math.floor(total) : 0;
        const ticketId = await this.generateTicketId();
        const venta = this.ventaRepository.create({
            ...createVentaDto,
            cliente,
            listaProductos: productosValidados,
            subTotal,
            descuento: descuentoTotal,
            total,
            puntosOtorgados,
            puntosUsados: puntosUsados || 0,
            ticketId,
            cajero,
            estado: venta_entity_1.EstadoVenta.COMPLETADO,
        });
        const ventaGuardada = await this.ventaRepository.save(venta);
        for (const item of productosValidados) {
            await this.productosService.descontarStock(item.codigoBarra, item.cantidad, cajero, ventaGuardada.id);
        }
        if (cliente) {
            if (puntosUsados > 0) {
                await this.clientesService.canjearPuntos(cliente.id, puntosUsados, ventaGuardada.id, 'Descuento en compra');
            }
            if (puntosOtorgados > 0) {
                await this.clientesService.acumularPuntos(cliente.id, puntosOtorgados, ventaGuardada.id, total);
            }
        }
        return this.findById(ventaGuardada.id);
    }
    async findAll(paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.ventaRepository.findAndCount({
            relations: ['cliente'],
            skip,
            take: limit,
            order: { fecha: 'DESC' },
        });
        const totalPages = Math.ceil(total / limit);
        return {
            data,
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        };
    }
    async findById(id) {
        const venta = await this.ventaRepository.findOne({
            where: { id },
            relations: ['cliente'],
        });
        if (!venta) {
            throw new common_1.NotFoundException('Venta no encontrada');
        }
        return venta;
    }
    async findByTicketId(ticketId) {
        const venta = await this.ventaRepository.findOne({
            where: { ticketId },
            relations: ['cliente'],
        });
        if (!venta) {
            throw new common_1.NotFoundException('Venta no encontrada');
        }
        return venta;
    }
    async findByDateRange(fechaInicio, fechaFin, paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.ventaRepository.findAndCount({
            where: {
                fecha: (0, typeorm_2.Between)(fechaInicio, fechaFin),
            },
            relations: ['cliente'],
            skip,
            take: limit,
            order: { fecha: 'DESC' },
        });
        const totalPages = Math.ceil(total / limit);
        return {
            data,
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        };
    }
    async findByCliente(clienteId, paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.ventaRepository.findAndCount({
            where: { cliente: { id: clienteId } },
            relations: ['cliente'],
            skip,
            take: limit,
            order: { fecha: 'DESC' },
        });
        const totalPages = Math.ceil(total / limit);
        return {
            data,
            total,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        };
    }
    async anularVenta(id, cajero) {
        const venta = await this.findById(id);
        if (venta.estado === venta_entity_1.EstadoVenta.ANULADO) {
            throw new common_1.BadRequestException('La venta ya está anulada');
        }
        for (const item of venta.listaProductos) {
            await this.productosService.devolverStock(item.codigoBarra, item.cantidad, cajero, venta.id);
        }
        if (venta.cliente) {
            if (venta.puntosOtorgados > 0) {
                await this.clientesService.canjearPuntos(venta.cliente.id, venta.puntosOtorgados, venta.id, 'Anulación de venta');
            }
            if (venta.puntosUsados > 0) {
                await this.clientesService.acumularPuntos(venta.cliente.id, venta.puntosUsados, venta.id, 0);
            }
        }
        await this.ventaRepository.update(id, { estado: venta_entity_1.EstadoVenta.ANULADO });
        return this.findById(id);
    }
    async getVentasDelDia() {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const ventas = await this.ventaRepository.find({
            where: {
                fecha: (0, typeorm_2.Between)(startOfDay, endOfDay),
                estado: venta_entity_1.EstadoVenta.COMPLETADO,
            },
            relations: ['cliente'],
            order: { fecha: 'DESC' },
        });
        const totalVentas = ventas.length;
        const totalMonto = ventas.reduce((sum, venta) => sum + venta.total, 0);
        return { ventas, totalVentas, totalMonto };
    }
    async getEstadisticasVentas(fechaInicio, fechaFin) {
        const ventas = await this.ventaRepository.find({
            where: {
                fecha: (0, typeorm_2.Between)(fechaInicio, fechaFin),
                estado: venta_entity_1.EstadoVenta.COMPLETADO,
            },
            relations: ['cliente'],
        });
        const totalVentas = ventas.length;
        const totalMonto = ventas.reduce((sum, venta) => sum + venta.total, 0);
        const promedioVenta = totalVentas > 0 ? totalMonto / totalVentas : 0;
        const ventasPorMetodo = ventas.reduce((acc, venta) => {
            acc[venta.metodoPago] = (acc[venta.metodoPago] || 0) + venta.total;
            return acc;
        }, {});
        const productosVendidos = {};
        ventas.forEach(venta => {
            venta.listaProductos.forEach(item => {
                if (!productosVendidos[item.codigoBarra]) {
                    productosVendidos[item.codigoBarra] = {
                        descripcion: item.descripcion,
                        cantidad: 0,
                        monto: 0,
                    };
                }
                productosVendidos[item.codigoBarra].cantidad += item.cantidad;
                productosVendidos[item.codigoBarra].monto += item.subtotal;
            });
        });
        const topProductos = Object.entries(productosVendidos)
            .map(([codigo, data]) => ({ codigoBarra: codigo, ...data }))
            .sort((a, b) => b.cantidad - a.cantidad)
            .slice(0, 10);
        return {
            totalVentas,
            totalMonto,
            promedioVenta,
            ventasPorMetodo,
            topProductos,
        };
    }
    async generateTicketId() {
        const today = new Date();
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const ventasDelDia = await this.ventaRepository.count({
            where: {
                fecha: (0, typeorm_2.Between)(startOfDay, endOfDay),
            },
        });
        const secuencial = (ventasDelDia + 1).toString().padStart(4, '0');
        return `${dateStr}-${secuencial}`;
    }
};
exports.VentasService = VentasService;
exports.VentasService = VentasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(venta_entity_1.Venta)),
    __param(1, (0, typeorm_1.InjectRepository)(cliente_entity_1.Cliente)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        productos_service_1.ProductosService,
        clientes_service_1.ClientesService])
], VentasService);
//# sourceMappingURL=ventas.service.js.map