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
exports.GastosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const gasto_entity_1 = require("../../entities/gasto.entity");
let GastosService = class GastosService {
    gastoRepository;
    constructor(gastoRepository) {
        this.gastoRepository = gastoRepository;
    }
    async create(createGastoDto, cajero) {
        const gasto = this.gastoRepository.create({
            ...createGastoDto,
            cajero,
        });
        return this.gastoRepository.save(gasto);
    }
    async findAll(paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.gastoRepository.findAndCount({
            skip,
            take: limit,
            order: { fecha: 'DESC' },
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
        const gasto = await this.gastoRepository.findOne({ where: { id } });
        if (!gasto) {
            throw new common_1.NotFoundException('Gasto no encontrado');
        }
        return gasto;
    }
    async findByDateRange(fechaInicio, fechaFin, paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.gastoRepository.findAndCount({
            where: {
                fecha: (0, typeorm_2.Between)(fechaInicio, fechaFin),
            },
            skip,
            take: limit,
            order: { fecha: 'DESC' },
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
    async findByCategoria(categoria, paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.gastoRepository.findAndCount({
            where: { categoria },
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
    async findByCajero(cajero, paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.gastoRepository.findAndCount({
            where: { cajero },
            skip,
            take: limit,
            order: { fecha: 'DESC' },
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
    async search(query, paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.gastoRepository.findAndCount({
            where: [
                { descripcion: (0, typeorm_2.Like)(`%${query}%`) },
                { proveedor: (0, typeorm_2.Like)(`%${query}%`) },
                { numeroComprobante: (0, typeorm_2.Like)(`%${query}%`) },
            ],
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
    async update(id, updateGastoDto) {
        await this.gastoRepository.update(id, updateGastoDto);
        return this.findById(id);
    }
    async remove(id) {
        const result = await this.gastoRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Gasto no encontrado');
        }
    }
    async getGastosDelDia() {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const gastos = await this.gastoRepository.find({
            where: {
                fecha: (0, typeorm_2.Between)(startOfDay, endOfDay),
            },
            order: { fecha: 'DESC' },
        });
        const totalGastos = gastos.length;
        const totalMonto = gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
        return { gastos, totalGastos, totalMonto };
    }
    async getEstadisticasGastos(fechaInicio, fechaFin) {
        const gastos = await this.gastoRepository.find({
            where: {
                fecha: (0, typeorm_2.Between)(fechaInicio, fechaFin),
            },
        });
        const totalGastos = gastos.length;
        const totalMonto = gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
        const promedioGasto = totalGastos > 0 ? totalMonto / totalGastos : 0;
        const gastosPorCategoria = gastos.reduce((acc, gasto) => {
            acc[gasto.categoria] = (acc[gasto.categoria] || 0) + gasto.monto;
            return acc;
        }, {});
        const gastosPorMetodo = gastos.reduce((acc, gasto) => {
            acc[gasto.metodoPago] = (acc[gasto.metodoPago] || 0) + gasto.monto;
            return acc;
        }, {});
        const gastosPorProveedor = gastos.reduce((acc, gasto) => {
            if (gasto.proveedor) {
                acc[gasto.proveedor] = (acc[gasto.proveedor] || 0) + gasto.monto;
            }
            return acc;
        }, {});
        const topProveedores = Object.entries(gastosPorProveedor)
            .map(([proveedor, monto]) => ({ proveedor, monto }))
            .sort((a, b) => b.monto - a.monto)
            .slice(0, 10);
        return {
            totalGastos,
            totalMonto,
            promedioGasto,
            gastosPorCategoria,
            gastosPorMetodo,
            topProveedores,
        };
    }
    async getCategorias() {
        return Object.values(gasto_entity_1.CategoriaGasto);
    }
};
exports.GastosService = GastosService;
exports.GastosService = GastosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(gasto_entity_1.Gasto)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GastosService);
//# sourceMappingURL=gastos.service.js.map