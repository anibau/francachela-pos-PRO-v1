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
exports.CombosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const combo_entity_1 = require("../../entities/combo.entity");
const producto_entity_1 = require("../../entities/producto.entity");
let CombosService = class CombosService {
    comboRepository;
    productoRepository;
    constructor(comboRepository, productoRepository) {
        this.comboRepository = comboRepository;
        this.productoRepository = productoRepository;
    }
    async create(createComboDto) {
        const productosIds = createComboDto.productos.map(p => p.productoId);
        const productos = await this.productoRepository.findByIds(productosIds);
        if (productos.length !== productosIds.length) {
            throw new common_1.BadRequestException('Uno o más productos no existen');
        }
        if (createComboDto.precioCombo >= createComboDto.precioOriginal) {
            throw new common_1.BadRequestException('El precio del combo debe ser menor al precio original');
        }
        const combo = this.comboRepository.create(createComboDto);
        return this.comboRepository.save(combo);
    }
    async findAll(paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.comboRepository.findAndCount({
            skip,
            take: limit,
            order: { nombre: 'ASC' },
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
        const combo = await this.comboRepository.findOne({ where: { id } });
        if (!combo) {
            throw new common_1.NotFoundException('Combo no encontrado');
        }
        return combo;
    }
    async findActivos(paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.comboRepository.findAndCount({
            where: { active: true },
            skip,
            take: limit,
            order: { nombre: 'ASC' },
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
    async update(id, updateComboDto) {
        const combo = await this.findById(id);
        if (updateComboDto.productos) {
            const productosIds = updateComboDto.productos.map(p => p.productoId);
            const productos = await this.productoRepository.findByIds(productosIds);
            if (productos.length !== productosIds.length) {
                throw new common_1.BadRequestException('Uno o más productos no existen');
            }
        }
        const precioOriginal = updateComboDto.precioOriginal || combo.precioOriginal;
        const precioCombo = updateComboDto.precioCombo || combo.precioCombo;
        if (precioCombo >= precioOriginal) {
            throw new common_1.BadRequestException('El precio del combo debe ser menor al precio original');
        }
        await this.comboRepository.update(id, updateComboDto);
        return this.findById(id);
    }
    async remove(id) {
        const result = await this.comboRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Combo no encontrado');
        }
    }
    async activate(id) {
        await this.comboRepository.update(id, { active: true });
        return this.findById(id);
    }
    async deactivate(id) {
        await this.comboRepository.update(id, { active: false });
        return this.findById(id);
    }
    async verificarDisponibilidad(comboId) {
        const combo = await this.findById(comboId);
        if (!combo.active) {
            return { disponible: false, productosNoDisponibles: ['Combo inactivo'] };
        }
        const productosNoDisponibles = [];
        for (const productoCombo of combo.productos) {
            const producto = await this.productoRepository.findOne({
                where: { id: productoCombo.productoId }
            });
            if (!producto) {
                productosNoDisponibles.push(`Producto ID ${productoCombo.productoId} no encontrado`);
                continue;
            }
            if (!producto.mostrar) {
                productosNoDisponibles.push(producto.productoDescripcion);
                continue;
            }
            if (producto.usaInventario && producto.cantidadActual < productoCombo.cantidad) {
                productosNoDisponibles.push(`${producto.productoDescripcion} (Stock insuficiente)`);
            }
        }
        return {
            disponible: productosNoDisponibles.length === 0,
            productosNoDisponibles
        };
    }
    async calcularAhorro(comboId) {
        const combo = await this.findById(comboId);
        const ahorro = combo.precioOriginal - combo.precioCombo;
        const porcentajeDescuento = (ahorro / combo.precioOriginal) * 100;
        return { ahorro, porcentajeDescuento };
    }
    async getCombosPopulares(limit = 10) {
        const combos = await this.comboRepository.find({
            where: { active: true },
            take: limit,
            order: { nombre: 'ASC' }
        });
        return combos.map(combo => ({
            ...combo,
            ahorro: combo.precioOriginal - combo.precioCombo,
            porcentajeDescuento: ((combo.precioOriginal - combo.precioCombo) / combo.precioOriginal) * 100
        }));
    }
};
exports.CombosService = CombosService;
exports.CombosService = CombosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(combo_entity_1.Combo)),
    __param(1, (0, typeorm_1.InjectRepository)(producto_entity_1.Producto)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CombosService);
//# sourceMappingURL=combos.service.js.map