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
exports.MovimientoInventarioService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const movimiento_inventario_entity_1 = require("../../entities/movimiento-inventario.entity");
const producto_entity_1 = require("../../entities/producto.entity");
const create_movimiento_dto_1 = require("./dto/create-movimiento.dto");
let MovimientoInventarioService = class MovimientoInventarioService {
    movimientoRepository;
    productoRepository;
    constructor(movimientoRepository, productoRepository) {
        this.movimientoRepository = movimientoRepository;
        this.productoRepository = productoRepository;
    }
    async create(createMovimientoDto) {
        const producto = await this.productoRepository.findOne({
            where: { codigoBarra: createMovimientoDto.codigoBarra }
        });
        if (!producto) {
            throw new common_1.NotFoundException('Producto no encontrado');
        }
        if (createMovimientoDto.tipo === create_movimiento_dto_1.TipoMovimiento.SALIDA) {
            if (producto.usaInventario && producto.cantidadActual < createMovimientoDto.cantidad) {
                throw new common_1.BadRequestException('Stock insuficiente para realizar la salida');
            }
        }
        let nuevaCantidad = producto.cantidadActual;
        switch (createMovimientoDto.tipo) {
            case create_movimiento_dto_1.TipoMovimiento.ENTRADA:
                nuevaCantidad += createMovimientoDto.cantidad;
                break;
            case create_movimiento_dto_1.TipoMovimiento.SALIDA:
                nuevaCantidad -= createMovimientoDto.cantidad;
                break;
            case create_movimiento_dto_1.TipoMovimiento.AJUSTE:
                nuevaCantidad = createMovimientoDto.cantidad;
                break;
        }
        const movimiento = this.movimientoRepository.create({
            codigoBarra: createMovimientoDto.codigoBarra,
            tipo: createMovimientoDto.tipo,
            cantidad: createMovimientoDto.cantidad,
            costo: createMovimientoDto.costo,
            precioVenta: createMovimientoDto.precioVenta,
            cajero: createMovimientoDto.cajero,
            proveedor: createMovimientoDto.proveedor,
            descripcion: producto.productoDescripcion,
            existencia: producto.cantidadActual,
            invMinimo: producto.cantidadMinima,
        });
        if (producto.usaInventario) {
            await this.productoRepository.update(producto.id, {
                cantidadActual: nuevaCantidad,
                costo: createMovimientoDto.costo,
                precio: createMovimientoDto.precioVenta,
            });
        }
        return this.movimientoRepository.save(movimiento);
    }
    async findAll(paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.movimientoRepository.findAndCount({
            skip,
            take: limit,
            order: { hora: 'DESC' },
        });
        const totalPages = Math.ceil(total / (limit || 10));
        return {
            data,
            total,
            page: page || 1,
            limit: limit || 10,
            totalPages,
            hasNextPage: (page || 1) < totalPages,
            hasPrevPage: (page || 1) > 1,
        };
    }
    async findById(id) {
        const movimiento = await this.movimientoRepository.findOne({ where: { id } });
        if (!movimiento) {
            throw new common_1.NotFoundException('Movimiento no encontrado');
        }
        return movimiento;
    }
    async findByProducto(codigoBarra, paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.movimientoRepository.findAndCount({
            where: { codigoBarra },
            skip,
            take: limit,
            order: { hora: 'DESC' },
        });
        const totalPages = Math.ceil(total / (limit || 10));
        return {
            data,
            total,
            page: page || 1,
            limit: limit || 10,
            totalPages,
            hasNextPage: (page || 1) < totalPages,
            hasPrevPage: (page || 1) > 1,
        };
    }
    async findByTipo(tipo, paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.movimientoRepository.findAndCount({
            where: { tipo },
            skip,
            take: limit,
            order: { hora: 'DESC' },
        });
        const totalPages = Math.ceil(total / (limit || 10));
        return {
            data,
            total,
            page: page || 1,
            limit: limit || 10,
            totalPages,
            hasNextPage: (page || 1) < totalPages,
            hasPrevPage: (page || 1) > 1,
        };
    }
    async findByDateRange(fechaInicio, fechaFin, paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.movimientoRepository.findAndCount({
            where: {
                hora: (0, typeorm_2.Between)(fechaInicio, fechaFin),
            },
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
    async findByCajero(cajero, paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.movimientoRepository.findAndCount({
            where: { cajero },
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
    async getMovimientosDelDia() {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const movimientos = await this.movimientoRepository.find({
            where: {
                hora: (0, typeorm_2.Between)(startOfDay, endOfDay),
            },
            order: { hora: 'DESC' },
        });
        return {
            movimientos,
            totalMovimientos: movimientos.length
        };
    }
    async getEstadisticasMovimientos(fechaInicio, fechaFin) {
        const movimientos = await this.movimientoRepository.find({
            where: {
                hora: (0, typeorm_2.Between)(fechaInicio, fechaFin),
            },
        });
        const totalMovimientos = movimientos.length;
        const movimientosPorTipo = movimientos.reduce((acc, mov) => {
            acc[mov.tipo] = (acc[mov.tipo] || 0) + 1;
            return acc;
        }, {});
        const movimientosPorCajero = movimientos.reduce((acc, mov) => {
            acc[mov.cajero] = (acc[mov.cajero] || 0) + 1;
            return acc;
        }, {});
        const productosMasMovidos = movimientos.reduce((acc, mov) => {
            const key = `${mov.codigoBarra} - ${mov.descripcion}`;
            acc[key] = (acc[key] || 0) + mov.cantidad;
            return acc;
        }, {});
        const valorTotalEntradas = movimientos
            .filter(m => m.tipo === create_movimiento_dto_1.TipoMovimiento.ENTRADA)
            .reduce((sum, m) => sum + (m.cantidad * m.costo), 0);
        const valorTotalSalidas = movimientos
            .filter(m => m.tipo === create_movimiento_dto_1.TipoMovimiento.SALIDA)
            .reduce((sum, m) => sum + (m.cantidad * m.precioVenta), 0);
        return {
            totalMovimientos,
            movimientosPorTipo,
            movimientosPorCajero,
            productosMasMovidos,
            valorTotalEntradas,
            valorTotalSalidas,
            entradas: movimientos.filter(m => m.tipo === create_movimiento_dto_1.TipoMovimiento.ENTRADA).length,
            salidas: movimientos.filter(m => m.tipo === create_movimiento_dto_1.TipoMovimiento.SALIDA).length,
            ajustes: movimientos.filter(m => m.tipo === create_movimiento_dto_1.TipoMovimiento.AJUSTE).length,
        };
    }
    async registrarVenta(codigoBarra, cantidad, precioVenta, cajero) {
        const createMovimientoDto = {
            codigoBarra,
            tipo: create_movimiento_dto_1.TipoMovimiento.SALIDA,
            cantidad,
            costo: 0,
            precioVenta,
            cajero,
        };
        const producto = await this.productoRepository.findOne({
            where: { codigoBarra }
        });
        if (producto) {
            createMovimientoDto.costo = producto.costo;
        }
        return this.create(createMovimientoDto);
    }
    async registrarEntrada(codigoBarra, cantidad, costo, precioVenta, cajero, proveedor) {
        const createMovimientoDto = {
            codigoBarra,
            tipo: create_movimiento_dto_1.TipoMovimiento.ENTRADA,
            cantidad,
            costo,
            precioVenta,
            cajero,
            proveedor,
        };
        return this.create(createMovimientoDto);
    }
    async registrarAjuste(codigoBarra, nuevaCantidad, costo, precioVenta, cajero) {
        const createMovimientoDto = {
            codigoBarra,
            tipo: create_movimiento_dto_1.TipoMovimiento.AJUSTE,
            cantidad: nuevaCantidad,
            costo,
            precioVenta,
            cajero,
        };
        return this.create(createMovimientoDto);
    }
};
exports.MovimientoInventarioService = MovimientoInventarioService;
exports.MovimientoInventarioService = MovimientoInventarioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(movimiento_inventario_entity_1.MovimientoInventario)),
    __param(1, (0, typeorm_1.InjectRepository)(producto_entity_1.Producto)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MovimientoInventarioService);
//# sourceMappingURL=movimiento-inventario.service.js.map