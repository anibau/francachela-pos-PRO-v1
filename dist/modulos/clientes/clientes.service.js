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
exports.ClientesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cliente_entity_1 = require("../../entities/cliente.entity");
const whatsapp_service_1 = require("../whatsapp/whatsapp.service");
let ClientesService = class ClientesService {
    clienteRepository;
    whatsappService;
    constructor(clienteRepository, whatsappService) {
        this.clienteRepository = clienteRepository;
        this.whatsappService = whatsappService;
    }
    async create(createClienteDto) {
        const existingClient = await this.clienteRepository.findOne({
            where: { dni: createClienteDto.dni },
        });
        if (existingClient) {
            throw new common_1.ConflictException('El DNI ya está registrado');
        }
        const codigoCorto = await this.generateCodigoCorto();
        const cliente = this.clienteRepository.create({
            ...createClienteDto,
            codigoCorto,
        });
        const clienteGuardado = await this.clienteRepository.save(cliente);
        if (clienteGuardado.telefono) {
            try {
                await this.whatsappService.sendWelcomeMessage(clienteGuardado.telefono, clienteGuardado.nombres, clienteGuardado.apellidos, clienteGuardado.codigoCorto);
            }
            catch (error) {
                console.error('Error enviando mensaje de bienvenida:', error);
            }
        }
        return clienteGuardado;
    }
    async findAll(paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.clienteRepository.findAndCount({
            where: { activo: true },
            skip,
            take: limit,
            order: { fechaRegistro: 'DESC' },
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
        const cliente = await this.clienteRepository.findOne({
            where: { id, activo: true }
        });
        if (!cliente) {
            throw new common_1.NotFoundException('Cliente no encontrado');
        }
        return cliente;
    }
    async findByDni(dni) {
        const cliente = await this.clienteRepository.findOne({
            where: { dni, activo: true }
        });
        if (!cliente) {
            throw new common_1.NotFoundException('Cliente no encontrado');
        }
        return cliente;
    }
    async findByCodigoCorto(codigoCorto) {
        const cliente = await this.clienteRepository.findOne({
            where: { codigoCorto, activo: true }
        });
        if (!cliente) {
            throw new common_1.NotFoundException('Cliente no encontrado');
        }
        return cliente;
    }
    async search(query, paginationDto) {
        const { page, limit, skip } = paginationDto;
        const [data, total] = await this.clienteRepository.findAndCount({
            where: [
                { nombres: (0, typeorm_2.Like)(`%${query}%`), activo: true },
                { apellidos: (0, typeorm_2.Like)(`%${query}%`), activo: true },
                { dni: (0, typeorm_2.Like)(`%${query}%`), activo: true },
                { telefono: (0, typeorm_2.Like)(`%${query}%`), activo: true },
                { codigoCorto: (0, typeorm_2.Like)(`%${query}%`), activo: true },
            ],
            skip,
            take: limit,
            order: { fechaRegistro: 'DESC' },
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
    async findCumpleaneros() {
        const today = new Date();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        return this.clienteRepository
            .createQueryBuilder('cliente')
            .where('cliente.activo = true')
            .andWhere('EXTRACT(MONTH FROM cliente.fechaNacimiento) = :month', { month })
            .andWhere('EXTRACT(DAY FROM cliente.fechaNacimiento) = :day', { day })
            .getMany();
    }
    async findTopClientes(limit = 10) {
        return this.clienteRepository.find({
            where: { activo: true },
            order: { puntosAcumulados: 'DESC' },
            take: limit,
        });
    }
    async update(id, updateClienteDto) {
        const cliente = await this.findById(id);
        if (updateClienteDto.dni && updateClienteDto.dni !== cliente.dni) {
            const existingClient = await this.clienteRepository.findOne({
                where: { dni: updateClienteDto.dni },
            });
            if (existingClient) {
                throw new common_1.ConflictException('El DNI ya está registrado');
            }
        }
        await this.clienteRepository.update(id, updateClienteDto);
        return this.findById(id);
    }
    async acumularPuntos(clienteId, puntos, ventaId, monto) {
        const cliente = await this.findById(clienteId);
        const nuevoPuntosAcumulados = cliente.puntosAcumulados + puntos;
        const nuevaCompra = {
            fecha: new Date(),
            ventaId,
            monto,
            puntosGanados: puntos,
        };
        const historialCompras = [...(cliente.historialCompras || []), nuevaCompra];
        await this.clienteRepository.update(clienteId, {
            puntosAcumulados: nuevoPuntosAcumulados,
            historialCompras,
        });
        return this.findById(clienteId);
    }
    async canjearPuntos(clienteId, puntosUsados, ventaId, descripcion) {
        const cliente = await this.findById(clienteId);
        if (cliente.puntosAcumulados < puntosUsados) {
            throw new common_1.ConflictException('Puntos insuficientes');
        }
        const nuevoPuntosAcumulados = cliente.puntosAcumulados - puntosUsados;
        const nuevoCanje = {
            fecha: new Date(),
            ventaId,
            puntosUsados,
            descripcion,
        };
        const historialCanjes = [...(cliente.historialCanjes || []), nuevoCanje];
        await this.clienteRepository.update(clienteId, {
            puntosAcumulados: nuevoPuntosAcumulados,
            historialCanjes,
        });
        return this.findById(clienteId);
    }
    async remove(id) {
        const cliente = await this.findById(id);
        await this.clienteRepository.update(id, { activo: false });
    }
    async activate(id) {
        await this.clienteRepository.update(id, { activo: true });
        const cliente = await this.clienteRepository.findOne({ where: { id } });
        if (!cliente) {
            throw new common_1.NotFoundException(`Cliente con ID ${id} no encontrado`);
        }
        return cliente;
    }
    async generateCodigoCorto() {
        let codigo = '';
        let exists = true;
        while (exists) {
            codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
            const existingClient = await this.clienteRepository.findOne({
                where: { codigoCorto: codigo },
            });
            exists = !!existingClient;
        }
        return codigo;
    }
    async getEstadisticasCliente(id) {
        const cliente = await this.findById(id);
        const totalCompras = cliente.historialCompras?.length || 0;
        const totalGastado = cliente.historialCompras?.reduce((sum, compra) => sum + compra.monto, 0) || 0;
        const totalCanjes = cliente.historialCanjes?.length || 0;
        const totalPuntosCanjeados = cliente.historialCanjes?.reduce((sum, canje) => sum + canje.puntosUsados, 0) || 0;
        return {
            cliente,
            estadisticas: {
                totalCompras,
                totalGastado,
                totalCanjes,
                totalPuntosCanjeados,
                puntosDisponibles: cliente.puntosAcumulados,
            },
        };
    }
    async sendClientInfoByDni(dni) {
        try {
            const cliente = await this.findByDni(dni);
            if (!cliente.telefono) {
                return {
                    success: false,
                    message: 'El cliente no tiene número de teléfono registrado',
                    cliente,
                };
            }
            const whatsappResult = await this.whatsappService.sendClientInfoMessage(cliente.telefono, cliente.nombres, cliente.apellidos, cliente.codigoCorto, cliente.puntosAcumulados);
            if (whatsappResult.success) {
                return {
                    success: true,
                    message: 'Información enviada al cliente exitosamente',
                    cliente,
                };
            }
            else {
                return {
                    success: false,
                    message: `Error enviando mensaje: ${whatsappResult.error}`,
                    cliente,
                };
            }
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                return {
                    success: false,
                    message: 'Cliente no encontrado con el DNI proporcionado',
                };
            }
            throw error;
        }
    }
};
exports.ClientesService = ClientesService;
exports.ClientesService = ClientesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cliente_entity_1.Cliente)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        whatsapp_service_1.WhatsappService])
], ClientesService);
//# sourceMappingURL=clientes.service.js.map