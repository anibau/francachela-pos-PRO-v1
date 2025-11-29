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
exports.CajaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const caja_entity_1 = require("../../entities/caja.entity");
const venta_entity_1 = require("../../entities/venta.entity");
const enums_1 = require("../../common/enums");
const gasto_entity_1 = require("../../entities/gasto.entity");
let CajaService = class CajaService {
    cajaRepository;
    ventaRepository;
    gastoRepository;
    constructor(cajaRepository, ventaRepository, gastoRepository) {
        this.cajaRepository = cajaRepository;
        this.ventaRepository = ventaRepository;
        this.gastoRepository = gastoRepository;
    }
    async abrirCaja(abrirCajaDto, cajero) {
        const cajaAbierta = await this.getCajaAbierta(cajero);
        if (cajaAbierta) {
            throw new common_1.BadRequestException('Ya existe una caja abierta para este cajero');
        }
        const caja = this.cajaRepository.create({
            ...abrirCajaDto,
            cajero,
            estado: caja_entity_1.EstadoCaja.ABIERTA,
            fechaApertura: new Date(),
        });
        return this.cajaRepository.save(caja);
    }
    async cerrarCaja(id, cerrarCajaDto) {
        const caja = await this.findById(id);
        if (caja.estado === caja_entity_1.EstadoCaja.CERRADA) {
            throw new common_1.BadRequestException('La caja ya está cerrada');
        }
        const { totalVentas, totalGastos, desglosePorMetodo } = await this.calcularTotalesCaja(caja);
        const montoEsperado = caja.montoInicial + totalVentas - totalGastos;
        const diferencia = cerrarCajaDto.montoFinal - montoEsperado;
        await this.cajaRepository.update(id, {
            fechaCierre: new Date(),
            totalVentas,
            totalGastos,
            montoFinal: cerrarCajaDto.montoFinal,
            diferencia,
            desglosePorMetodo,
            observaciones: cerrarCajaDto.observaciones,
            estado: caja_entity_1.EstadoCaja.CERRADA,
        });
        return this.findById(id);
    }
    async findAll(paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.cajaRepository.findAndCount({
            skip,
            take: limit,
            order: { fechaApertura: 'DESC' },
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
        const caja = await this.cajaRepository.findOne({ where: { id } });
        if (!caja) {
            throw new common_1.NotFoundException('Caja no encontrada');
        }
        return caja;
    }
    async getCajaAbierta(cajero) {
        const whereCondition = { estado: caja_entity_1.EstadoCaja.ABIERTA };
        if (cajero) {
            whereCondition.cajero = cajero;
        }
        return this.cajaRepository.findOne({ where: whereCondition });
    }
    async getCajaActual(cajero) {
        const caja = await this.getCajaAbierta(cajero);
        if (!caja) {
            throw new common_1.NotFoundException('No hay una caja abierta para este cajero');
        }
        return caja;
    }
    async getResumenCajaActual(cajero) {
        const caja = await this.getCajaActual(cajero);
        const { totalVentas, totalGastos, desglosePorMetodo } = await this.calcularTotalesCaja(caja);
        const montoEsperado = caja.montoInicial + totalVentas - totalGastos;
        return {
            caja,
            montoInicial: caja.montoInicial,
            totalVentas,
            totalGastos,
            montoEsperado,
            desglosePorMetodo,
        };
    }
    async calcularTotalesCaja(caja) {
        const fechaInicio = caja.fechaApertura;
        const fechaFin = caja.fechaCierre || new Date();
        const ventas = await this.ventaRepository.find({
            where: {
                fecha: (0, typeorm_2.Between)(fechaInicio, fechaFin),
                cajero: caja.cajero,
                estado: enums_1.EstadoVenta.COMPLETADO,
            },
        });
        const totalVentas = ventas.reduce((sum, venta) => sum + venta.total, 0);
        const desglosePorMetodo = ventas.reduce((acc, venta) => {
            acc[venta.metodoPago] = (acc[venta.metodoPago] || 0) + venta.total;
            return acc;
        }, {});
        const gastos = await this.gastoRepository.find({
            where: {
                fecha: (0, typeorm_2.Between)(fechaInicio, fechaFin),
                cajero: caja.cajero,
            },
        });
        const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
        return {
            totalVentas,
            totalGastos,
            desglosePorMetodo,
        };
    }
    async getCajasPorFecha(fechaInicio, fechaFin) {
        return this.cajaRepository.find({
            where: {
                fechaApertura: (0, typeorm_2.Between)(fechaInicio, fechaFin),
            },
            order: { fechaApertura: 'DESC' },
        });
    }
    async getEstadisticasCajas(fechaInicio, fechaFin) {
        const cajas = await this.getCajasPorFecha(fechaInicio, fechaFin);
        const totalCajas = cajas.length;
        const cajasAbiertas = cajas.filter(c => c.estado === caja_entity_1.EstadoCaja.ABIERTA).length;
        const cajasCerradas = cajas.filter(c => c.estado === caja_entity_1.EstadoCaja.CERRADA).length;
        const totalVentas = cajas.reduce((sum, caja) => sum + (caja.totalVentas || 0), 0);
        const totalGastos = cajas.reduce((sum, caja) => sum + (caja.totalGastos || 0), 0);
        const totalDiferencias = cajas.reduce((sum, caja) => sum + (caja.diferencia || 0), 0);
        return {
            totalCajas,
            cajasAbiertas,
            cajasCerradas,
            totalVentas,
            totalGastos,
            totalDiferencias,
            promedioVentasPorCaja: totalCajas > 0 ? totalVentas / totalCajas : 0,
        };
    }
};
exports.CajaService = CajaService;
exports.CajaService = CajaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(caja_entity_1.Caja)),
    __param(1, (0, typeorm_1.InjectRepository)(venta_entity_1.Venta)),
    __param(2, (0, typeorm_1.InjectRepository)(gasto_entity_1.Gasto)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CajaService);
//# sourceMappingURL=caja.service.js.map