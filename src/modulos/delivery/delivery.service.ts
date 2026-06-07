import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Delivery } from '../../entities/delivery.entity';
import { Cliente } from '../../entities/cliente.entity';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { EstadoDelivery } from '../../common/enums';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  async create(createDeliveryDto: CreateDeliveryDto): Promise<Delivery> {
    // Validar cliente si se proporciona
    if (createDeliveryDto.clienteId) {
      const cliente = await this.clienteRepository.findOne({ 
        where: { id: createDeliveryDto.clienteId } 
      });
      if (!cliente) {
        throw new NotFoundException('Cliente no encontrado');
      }
    }

    const delivery = this.deliveryRepository.create({
      ...createDeliveryDto,
      estado: EstadoDelivery.PENDIENTE,
    });

    return this.deliveryRepository.save(delivery);
  }

  async findAll(paginationDto?: PaginationDto): Promise<PaginatedResult<Delivery>> {
    const { page, limit, skip } = paginationDto ?? new PaginationDto();

    const [data, total] = await this.deliveryRepository.findAndCount({
      relations: ['cliente'],
      order: { fecha: 'DESC' },
      skip,
      take: limit,
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

  async findById(id: number): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOne({ 
      where: { id },
      relations: ['cliente']
    });
    if (!delivery) {
      throw new NotFoundException('Delivery no encontrado');
    }
    return delivery;
  }

  async findByEstado(estado: EstadoDelivery, paginationDto: PaginationDto): Promise<PaginatedResult<Delivery>> {
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

  async findByRepartidor(repartidor: string, paginationDto: PaginationDto): Promise<PaginatedResult<Delivery>> {
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

  async findByDateRange(fechaInicio: Date, fechaFin: Date, paginationDto: PaginationDto): Promise<PaginatedResult<Delivery>> {
    const { page, limit, skip } = paginationDto;

    const [data, total] = await this.deliveryRepository.findAndCount({
      where: {
        fecha: Between(fechaInicio, fechaFin),
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

  async update(id: number, updateDeliveryDto: UpdateDeliveryDto): Promise<Delivery> {
    const delivery = await this.findById(id);

    // Validar cliente si se actualiza
    if (updateDeliveryDto.clienteId) {
      const cliente = await this.clienteRepository.findOne({ 
        where: { id: updateDeliveryDto.clienteId } 
      });
      if (!cliente) {
        throw new NotFoundException('Cliente no encontrado');
      }
    }

    await this.deliveryRepository.update(id, updateDeliveryDto);
    return this.findById(id);
  }

  async asignarRepartidor(id: number, repartidor: string): Promise<Delivery> {
    const delivery = await this.findById(id);

    if (delivery.estado !== EstadoDelivery.PENDIENTE) {
      throw new BadRequestException('Solo se pueden asignar deliveries pendientes');
    }

    await this.deliveryRepository.update(id, { 
      repartidor,
      estado: EstadoDelivery.ASIGNADO 
    });

    return this.findById(id);
  }

  async marcarEnCamino(id: number, horaSalida: string): Promise<Delivery> {
    const delivery = await this.findById(id);

    if (delivery.estado !== EstadoDelivery.ASIGNADO) {
      throw new BadRequestException('El delivery debe estar asignado para marcarlo en camino');
    }

    await this.deliveryRepository.update(id, { 
      estado: EstadoDelivery.EN_CAMINO,
      horaSalida 
    });

    return this.findById(id);
  }

  async marcarEntregado(id: number, horaEntrega: string): Promise<Delivery> {
    const delivery = await this.findById(id);

    if (delivery.estado !== EstadoDelivery.EN_CAMINO) {
      throw new BadRequestException('El delivery debe estar en camino para marcarlo como entregado');
    }

    await this.deliveryRepository.update(id, { 
      estado: EstadoDelivery.ENTREGADO,
      horaEntrega 
    });

    return this.findById(id);
  }

  async cancelar(id: number): Promise<Delivery> {
    const delivery = await this.findById(id);

    if (delivery.estado === EstadoDelivery.ENTREGADO) {
      throw new BadRequestException('No se puede cancelar un delivery ya entregado');
    }

    await this.deliveryRepository.update(id, { estado: EstadoDelivery.CANCELADO });
    return this.findById(id);
  }

  async getDeliveriesDelDia(): Promise<{ deliveries: Delivery[], totalDeliveries: number, totalFees: number }> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const deliveries = await this.deliveryRepository.find({
      where: {
        fecha: Between(startOfDay, endOfDay),
      },
      relations: ['cliente'],
      order: { fecha: 'DESC' },
    });

    const totalDeliveries = deliveries.length;
    const totalFees = deliveries.reduce((sum, delivery) => sum + (delivery.deliveryFee || 0), 0);

    return { deliveries, totalDeliveries, totalFees };
  }

  async getEstadisticasDelivery(fechaInicio: Date, fechaFin: Date): Promise<any> {
    const deliveries = await this.deliveryRepository.find({
      where: {
        fecha: Between(fechaInicio, fechaFin),
      },
      relations: ['cliente'],
    });

    const totalDeliveries = deliveries.length;
    const totalFees = deliveries.reduce((sum, delivery) => sum + (delivery.deliveryFee || 0), 0);
    const promedioFee = totalDeliveries > 0 ? totalFees / totalDeliveries : 0;

    // Agrupar por estado
    const deliveriesPorEstado = deliveries.reduce((acc, delivery) => {
      acc[delivery.estado] = (acc[delivery.estado] || 0) + 1;
      return acc;
    }, {});

    // Agrupar por repartidor
    const deliveriesPorRepartidor = deliveries.reduce((acc, delivery) => {
      acc[delivery.repartidor] = (acc[delivery.repartidor] || 0) + 1;
      return acc;
    }, {});

    // Calcular tiempo promedio de entrega (solo entregados)
    const entregados = deliveries.filter(d => d.estado === EstadoDelivery.ENTREGADO && d.horaSalida && d.horaEntrega);
    let tiempoPromedioEntrega = 0;

    if (entregados.length > 0) {
      const tiempos = entregados.map(d => {
        const salida = new Date(`2000-01-01 ${d.horaSalida}`);
        const entrega = new Date(`2000-01-01 ${d.horaEntrega}`);
        return (entrega.getTime() - salida.getTime()) / (1000 * 60); // minutos
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
      cancelados: deliveries.filter(d => d.estado === EstadoDelivery.CANCELADO).length,
    };
  }

  async getRepartidores(): Promise<string[]> {
    const result = await this.deliveryRepository
      .createQueryBuilder('delivery')
      .select('DISTINCT delivery.repartidor', 'repartidor')
      .getRawMany();

    return result.map(r => r.repartidor).filter(r => r);
  }
}
