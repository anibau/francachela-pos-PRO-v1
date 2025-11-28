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
exports.DeliveryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const delivery_entity_1 = require("../../entities/delivery.entity");
const cliente_entity_1 = require("../../entities/cliente.entity");
const enums_1 = require("../../common/enums");
let DeliveryService = class DeliveryService {
    deliveryRepository;
    clienteRepository;
    constructor(deliveryRepository, clienteRepository) {
        this.deliveryRepository = deliveryRepository;
        this.clienteRepository = clienteRepository;
    }
    async create(createDeliveryDto) {
        if (createDeliveryDto.clienteId) {
            const cliente = await this.clienteRepository.findOne({
                where: { id: createDeliveryDto.clienteId }
            });
            if (!cliente) {
                throw new common_1.NotFoundException('Cliente no encontrado');
            }
        }
        const delivery = this.deliveryRepository.create({
            ...createDeliveryDto,
            estado: enums_1.EstadoDelivery.PENDIENTE,
        });
        return this.deliveryRepository.save(delivery);
    }
    async findAll(paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.deliveryRepository.findAndCount({
            relations: ['cliente'],
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
        const delivery = await this.deliveryRepository.findOne({
            where: { id },
            relations: ['cliente']
        });
        if (!delivery) {
            throw new common_1.NotFoundException('Delivery no encontrado');
        }
        return delivery;
    }
    async findByEstado(estado, paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.deliveryRepository.findAndCount({
            where: { estado },
            relations: ['cliente'],
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
    async findByRepartidor(repartidor, paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.deliveryRepository.findAndCount({
            where: { repartidor },
            relations: ['cliente'],
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
    async findByDateRange(fechaInicio, fechaFin, paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.deliveryRepository.findAndCount({
            where: {
                fecha: (0, typeorm_2.Between)(fechaInicio, fechaFin),
            },
            relations: ['cliente'],
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
    async update(id, updateDeliveryDto) {
        const delivery = await this.findById(id);
        if (updateDeliveryDto.clienteId) {
            const cliente = await this.clienteRepository.findOne({
                where: { id: updateDeliveryDto.clienteId }
            });
            if (!cliente) {
                throw new common_1.NotFoundException('Cliente no encontrado');
            }
        }
        await this.deliveryRepository.update(id, updateDeliveryDto);
        return this.findById(id);
    }
    async asignarRepartidor(id, repartidor) {
        const delivery = await this.findById(id);
        if (delivery.estado !== enums_1.EstadoDelivery.PENDIENTE) {
            throw new common_1.BadRequestException('Solo se pueden asignar deliveries pendientes');
        }
        await this.deliveryRepository.update(id, {
            repartidor,
            estado: enums_1.EstadoDelivery.ASIGNADO
        });
        return this.findById(id);
    }
    async marcarEnCamino(id, horaSalida) {
        const delivery = await this.findById(id);
        if (delivery.estado !== enums_1.EstadoDelivery.ASIGNADO) {
            throw new common_1.BadRequestException('El delivery debe estar asignado para marcarlo en camino');
        }
        await this.deliveryRepository.update(id, {
            estado: enums_1.EstadoDelivery.EN_CAMINO,
            horaSalida
        });
        return this.findById(id);
    }
    async marcarEntregado(id, horaEntrega) {
        const delivery = await this.findById(id);
        if (delivery.estado !== enums_1.EstadoDelivery.EN_CAMINO) {
            throw new common_1.BadRequestException('El delivery debe estar en camino para marcarlo como entregado');
        }
        await this.deliveryRepository.update(id, {
            estado: enums_1.EstadoDelivery.ENTREGADO,
            horaEntrega
        });
        return this.findById(id);
    }
    async cancelar(id) {
        const delivery = await this.findById(id);
        if (delivery.estado === enums_1.EstadoDelivery.ENTREGADO) {
            throw new common_1.BadRequestException('No se puede cancelar un delivery ya entregado');
        }
        await this.deliveryRepository.update(id, { estado: enums_1.EstadoDelivery.CANCELADO });
        return this.findById(id);
    }
    async getDeliveriesDelDia() {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const deliveries = await this.deliveryRepository.find({
            where: {
                fecha: (0, typeorm_2.Between)(startOfDay, endOfDay),
            },
            relations: ['cliente'],
            order: { fecha: 'DESC' },
        });
        const totalDeliveries = deliveries.length;
        const totalFees = deliveries.reduce((sum, delivery) => sum + (delivery.deliveryFee || 0), 0);
        return { deliveries, totalDeliveries, totalFees };
    }
    async getEstadisticasDelivery(fechaInicio, fechaFin) {
        const deliveries = await this.deliveryRepository.find({
            where: {
                fecha: (0, typeorm_2.Between)(fechaInicio, fechaFin),
            },
            relations: ['cliente'],
        });
        const totalDeliveries = deliveries.length;
        const totalFees = deliveries.reduce((sum, delivery) => sum + (delivery.deliveryFee || 0), 0);
        const promedioFee = totalDeliveries > 0 ? totalFees / totalDeliveries : 0;
        const deliveriesPorEstado = deliveries.reduce((acc, delivery) => {
            acc[delivery.estado] = (acc[delivery.estado] || 0) + 1;
            return acc;
        }, {});
        const deliveriesPorRepartidor = deliveries.reduce((acc, delivery) => {
            acc[delivery.repartidor] = (acc[delivery.repartidor] || 0) + 1;
            return acc;
        }, {});
        const entregados = deliveries.filter(d => d.estado === enums_1.EstadoDelivery.ENTREGADO && d.horaSalida && d.horaEntrega);
        let tiempoPromedioEntrega = 0;
        if (entregados.length > 0) {
            const tiempos = entregados.map(d => {
                const salida = new Date(`2000-01-01 ${d.horaSalida}`);
                const entrega = new Date(`2000-01-01 ${d.horaEntrega}`);
                return (entrega.getTime() - salida.getTime()) / (1000 * 60);
            });
            tiempoPromedioEntrega = tiempos.reduce((sum, tiempo) => sum + tiempo, 0) / tiempos.length;
        }
        return {
            totalDeliveries,
            totalFees,
            promedioFee,
            deliveriesPorEstado,
            deliveriesPorRepartidor,
            tiempoPromedioEntrega: Math.round(tiempoPromedioEntrega),
            entregados: entregados.length,
            cancelados: deliveries.filter(d => d.estado === enums_1.EstadoDelivery.CANCELADO).length,
        };
    }
    async getRepartidores() {
        const result = await this.deliveryRepository
            .createQueryBuilder('delivery')
            .select('DISTINCT delivery.repartidor', 'repartidor')
            .getRawMany();
        return result.map(r => r.repartidor).filter(r => r);
    }
};
exports.DeliveryService = DeliveryService;
exports.DeliveryService = DeliveryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(delivery_entity_1.Delivery)),
    __param(1, (0, typeorm_1.InjectRepository)(cliente_entity_1.Cliente)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], DeliveryService);
//# sourceMappingURL=delivery.service.js.map