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
exports.ProductosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const producto_entity_1 = require("../../entities/producto.entity");
const movimiento_inventario_entity_1 = require("../../entities/movimiento-inventario.entity");
let ProductosService = class ProductosService {
    productoRepository;
    movimientoRepository;
    constructor(productoRepository, movimientoRepository) {
        this.productoRepository = productoRepository;
        this.movimientoRepository = movimientoRepository;
    }
    async create(createProductoDto, cajero) {
        const existingProduct = await this.productoRepository.findOne({
            where: { codigoBarra: createProductoDto.codigoBarra },
        });
        if (existingProduct) {
            throw new common_1.ConflictException('El código de barras ya existe');
        }
        const producto = this.productoRepository.create(createProductoDto);
        const savedProduct = await this.productoRepository.save(producto);
        if (savedProduct.cantidadActual > 0) {
            await this.registrarMovimiento({
                codigoBarra: savedProduct.codigoBarra,
                descripcion: savedProduct.productoDescripcion,
                costo: savedProduct.costo,
                precioVenta: savedProduct.precio,
                existenciaAnterior: 0,
                existenciaNueva: savedProduct.cantidadActual,
                invMinimo: savedProduct.cantidadMinima,
                tipo: movimiento_inventario_entity_1.TipoMovimiento.ENTRADA,
                cantidad: savedProduct.cantidadActual,
                cajero,
                observaciones: 'Stock inicial del producto',
            });
        }
        return savedProduct;
    }
    async findAll(paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.productoRepository.findAndCount({
            skip,
            take: limit,
            order: { fechaCreacion: 'DESC' },
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
        const producto = await this.productoRepository.findOne({ where: { id } });
        if (!producto) {
            throw new common_1.NotFoundException('Producto no encontrado');
        }
        return producto;
    }
    async findByCodigoBarra(codigoBarra) {
        const producto = await this.productoRepository.findOne({ where: { codigoBarra } });
        if (!producto) {
            throw new common_1.NotFoundException('Producto no encontrado');
        }
        return producto;
    }
    async search(query, paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.productoRepository.findAndCount({
            where: [
                { productoDescripcion: (0, typeorm_2.Like)(`%${query}%`) },
                { codigoBarra: (0, typeorm_2.Like)(`%${query}%`) },
                { categoria: (0, typeorm_2.Like)(`%${query}%`) },
                { proveedor: (0, typeorm_2.Like)(`%${query}%`) },
            ],
            skip,
            take: limit,
            order: { fechaCreacion: 'DESC' },
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
    async findByCategoria(categoria, paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.productoRepository.findAndCount({
            where: { categoria },
            skip,
            take: limit,
            order: { productoDescripcion: 'ASC' },
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
    async findStockBajo() {
        return this.productoRepository
            .createQueryBuilder('producto')
            .where('producto.cantidadActual <= producto.cantidadMinima')
            .andWhere('producto.usaInventario = true')
            .andWhere('producto.mostrar = true')
            .orderBy('producto.cantidadActual', 'ASC')
            .getMany();
    }
    async getCategorias() {
        const result = await this.productoRepository
            .createQueryBuilder('producto')
            .select('DISTINCT producto.categoria', 'categoria')
            .where('producto.categoria IS NOT NULL')
            .andWhere('producto.categoria != \'\'')
            .getRawMany();
        return result.map(r => r.categoria);
    }
    async update(id, updateProductoDto) {
        const producto = await this.findById(id);
        if (updateProductoDto.codigoBarra && updateProductoDto.codigoBarra !== producto.codigoBarra) {
            const existingProduct = await this.productoRepository.findOne({
                where: { codigoBarra: updateProductoDto.codigoBarra },
            });
            if (existingProduct) {
                throw new common_1.ConflictException('El código de barras ya existe');
            }
        }
        await this.productoRepository.update(id, updateProductoDto);
        return this.findById(id);
    }
    async actualizarStock(id, actualizarStockDto, cajero) {
        const producto = await this.findById(id);
        const { cantidad, tipo, observaciones, proveedor, numeroFactura } = actualizarStockDto;
        const existenciaAnterior = producto.cantidadActual;
        let existenciaNueva;
        switch (tipo) {
            case movimiento_inventario_entity_1.TipoMovimiento.ENTRADA:
                existenciaNueva = existenciaAnterior + cantidad;
                break;
            case movimiento_inventario_entity_1.TipoMovimiento.SALIDA:
                existenciaNueva = Math.max(0, existenciaAnterior - cantidad);
                break;
            case movimiento_inventario_entity_1.TipoMovimiento.AJUSTE:
                existenciaNueva = cantidad;
                break;
            default:
                throw new Error('Tipo de movimiento no válido');
        }
        await this.productoRepository.update(id, { cantidadActual: existenciaNueva });
        await this.registrarMovimiento({
            codigoBarra: producto.codigoBarra,
            descripcion: producto.productoDescripcion,
            costo: producto.costo,
            precioVenta: producto.precio,
            existenciaAnterior,
            existenciaNueva,
            invMinimo: producto.cantidadMinima,
            tipo,
            cantidad: tipo === movimiento_inventario_entity_1.TipoMovimiento.AJUSTE ? existenciaNueva - existenciaAnterior : cantidad,
            cajero,
            proveedor,
            numeroFactura,
            observaciones,
        });
        return this.findById(id);
    }
    async descontarStock(codigoBarra, cantidad, cajero, ventaId) {
        const producto = await this.findByCodigoBarra(codigoBarra);
        if (!producto.usaInventario) {
            return;
        }
        const existenciaAnterior = producto.cantidadActual;
        const existenciaNueva = Math.max(0, existenciaAnterior - cantidad);
        await this.productoRepository.update(producto.id, { cantidadActual: existenciaNueva });
        await this.registrarMovimiento({
            codigoBarra: producto.codigoBarra,
            descripcion: producto.productoDescripcion,
            costo: producto.costo,
            precioVenta: producto.precio,
            existenciaAnterior,
            existenciaNueva,
            invMinimo: producto.cantidadMinima,
            tipo: movimiento_inventario_entity_1.TipoMovimiento.VENTA,
            cantidad,
            cajero,
            ventaId,
            observaciones: `Venta - Ticket ID: ${ventaId}`,
        });
    }
    async devolverStock(codigoBarra, cantidad, cajero, ventaId) {
        const producto = await this.findByCodigoBarra(codigoBarra);
        if (!producto.usaInventario) {
            return;
        }
        const existenciaAnterior = producto.cantidadActual;
        const existenciaNueva = existenciaAnterior + cantidad;
        await this.productoRepository.update(producto.id, { cantidadActual: existenciaNueva });
        await this.registrarMovimiento({
            codigoBarra: producto.codigoBarra,
            descripcion: producto.productoDescripcion,
            costo: producto.costo,
            precioVenta: producto.precio,
            existenciaAnterior,
            existenciaNueva,
            invMinimo: producto.cantidadMinima,
            tipo: movimiento_inventario_entity_1.TipoMovimiento.DEVOLUCION,
            cantidad,
            cajero,
            ventaId,
            observaciones: `Devolución - Ticket ID: ${ventaId}`,
        });
    }
    async remove(id) {
        const producto = await this.findById(id);
        await this.productoRepository.update(id, { mostrar: false });
    }
    async activate(id) {
        await this.productoRepository.update(id, { mostrar: true });
        return this.findById(id);
    }
    async registrarMovimiento(movimientoData) {
        const movimiento = this.movimientoRepository.create(movimientoData);
        return this.movimientoRepository.save(movimiento);
    }
    async getMovimientosInventario(paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.movimientoRepository.findAndCount({
            skip,
            take: limit,
            order: { hora: 'DESC' },
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
    async getMovimientosByProducto(codigoBarra, paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.movimientoRepository.findAndCount({
            where: { codigoBarra },
            skip,
            take: limit,
            order: { hora: 'DESC' },
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
};
exports.ProductosService = ProductosService;
exports.ProductosService = ProductosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(producto_entity_1.Producto)),
    __param(1, (0, typeorm_1.InjectRepository)(movimiento_inventario_entity_1.MovimientoInventario)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProductosService);
//# sourceMappingURL=productos.service.js.map