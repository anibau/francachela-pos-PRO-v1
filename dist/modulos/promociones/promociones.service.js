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
exports.PromocionesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const promocion_entity_1 = require("../../entities/promocion.entity");
let PromocionesService = class PromocionesService {
    promocionRepository;
    constructor(promocionRepository) {
        this.promocionRepository = promocionRepository;
    }
    async create(createPromocionDto) {
        const promocion = this.promocionRepository.create(createPromocionDto);
        return this.promocionRepository.save(promocion);
    }
    async findAll(paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.promocionRepository.findAndCount({
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
        const promocion = await this.promocionRepository.findOne({ where: { id } });
        if (!promocion) {
            throw new common_1.NotFoundException('Promoción no encontrada');
        }
        return promocion;
    }
    async findActivas() {
        const today = new Date();
        return this.promocionRepository.find({
            where: {
                activo: true,
                fechaInicio: (0, typeorm_2.LessThanOrEqual)(today),
                fechaFin: (0, typeorm_2.MoreThanOrEqual)(today),
            },
            order: { fechaCreacion: 'DESC' },
        });
    }
    async findByTipo(tipo) {
        return this.promocionRepository.find({
            where: { tipo, activo: true },
            order: { fechaCreacion: 'DESC' },
        });
    }
    async update(id, updatePromocionDto) {
        await this.promocionRepository.update(id, updatePromocionDto);
        return this.findById(id);
    }
    async remove(id) {
        await this.promocionRepository.update(id, { activo: false });
    }
    async activate(id) {
        await this.promocionRepository.update(id, { activo: true });
        return this.findById(id);
    }
    async aplicarPromocion(promocionId, montoCompra) {
        const promocion = await this.findById(promocionId);
        if (!promocion.activo) {
            return { descuento: 0, aplicable: false };
        }
        const today = new Date();
        if (today < promocion.fechaInicio || today > promocion.fechaFin) {
            return { descuento: 0, aplicable: false };
        }
        if (promocion.montoMinimo && montoCompra < promocion.montoMinimo) {
            return { descuento: 0, aplicable: false };
        }
        if (promocion.cantidadMaximaUsos && promocion.cantidadUsada >= promocion.cantidadMaximaUsos) {
            return { descuento: 0, aplicable: false };
        }
        let descuento = 0;
        switch (promocion.tipo) {
            case promocion_entity_1.TipoPromocion.PORCENTAJE:
                descuento = (montoCompra * promocion.descuento) / 100;
                break;
            case promocion_entity_1.TipoPromocion.MONTO:
                descuento = promocion.descuento;
                break;
            case promocion_entity_1.TipoPromocion.DOS_X_UNO:
            case promocion_entity_1.TipoPromocion.TRES_X_DOS:
                descuento = 0;
                break;
        }
        await this.promocionRepository.update(promocionId, {
            cantidadUsada: promocion.cantidadUsada + 1,
        });
        return { descuento, aplicable: true };
    }
    async getPromocionesVencidas() {
        const today = new Date();
        return this.promocionRepository.find({
            where: {
                activo: true,
                fechaFin: (0, typeorm_2.LessThanOrEqual)(today),
            },
        });
    }
    async desactivarVencidas() {
        const promocionesVencidas = await this.getPromocionesVencidas();
        for (const promocion of promocionesVencidas) {
            await this.promocionRepository.update(promocion.id, { activo: false });
        }
        return promocionesVencidas.length;
    }
};
exports.PromocionesService = PromocionesService;
exports.PromocionesService = PromocionesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(promocion_entity_1.Promocion)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PromocionesService);
//# sourceMappingURL=promociones.service.js.map