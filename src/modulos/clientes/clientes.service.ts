import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Cliente } from '../../entities/cliente.entity';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    // Verificar que el DNI no exista
    const existingClient = await this.clienteRepository.findOne({
      where: { dni: createClienteDto.dni },
    });

    if (existingClient) {
      throw new ConflictException('El DNI ya está registrado');
    }

    // Generar código corto único
    const codigoCorto = await this.generateCodigoCorto();

    const cliente = this.clienteRepository.create({
      ...createClienteDto,
      codigoCorto,
    });

    return this.clienteRepository.save(cliente);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Cliente>> {
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

  async findById(id: number): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({ 
      where: { id, activo: true } 
    });
    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }
    return cliente;
  }

  async findByDni(dni: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({ 
      where: { dni, activo: true } 
    });
    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }
    return cliente;
  }

  async findByCodigoCorto(codigoCorto: string): Promise<Cliente> {
    const cliente = await this.clienteRepository.findOne({ 
      where: { codigoCorto, activo: true } 
    });
    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }
    return cliente;
  }

  async search(query: string, paginationDto: PaginationDto): Promise<PaginatedResult<Cliente>> {
    const { page, limit, skip } = paginationDto;

    const [data, total] = await this.clienteRepository.findAndCount({
      where: [
        { nombres: Like(`%${query}%`), activo: true },
        { apellidos: Like(`%${query}%`), activo: true },
        { dni: Like(`%${query}%`), activo: true },
        { telefono: Like(`%${query}%`), activo: true },
        { codigoCorto: Like(`%${query}%`), activo: true },
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

  async findCumpleaneros(): Promise<Cliente[]> {
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

  async findTopClientes(limit: number = 10): Promise<Cliente[]> {
    return this.clienteRepository.find({
      where: { activo: true },
      order: { puntosAcumulados: 'DESC' },
      take: limit,
    });
  }

  async update(id: number, updateClienteDto: UpdateClienteDto): Promise<Cliente> {
    const cliente = await this.findById(id);

    if (updateClienteDto.dni && updateClienteDto.dni !== cliente.dni) {
      const existingClient = await this.clienteRepository.findOne({
        where: { dni: updateClienteDto.dni },
      });
      if (existingClient) {
        throw new ConflictException('El DNI ya está registrado');
      }
    }

    await this.clienteRepository.update(id, updateClienteDto);
    return this.findById(id);
  }

  async acumularPuntos(clienteId: number, puntos: number, ventaId: number, monto: number): Promise<Cliente> {
    const cliente = await this.findById(clienteId);
    
    const nuevoPuntosAcumulados = cliente.puntosAcumulados + puntos;
    
    // Actualizar historial de compras
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

  async canjearPuntos(clienteId: number, puntosUsados: number, ventaId: number, descripcion: string): Promise<Cliente> {
    const cliente = await this.findById(clienteId);
    
    if (cliente.puntosAcumulados < puntosUsados) {
      throw new ConflictException('Puntos insuficientes');
    }

    const nuevoPuntosAcumulados = cliente.puntosAcumulados - puntosUsados;
    
    // Actualizar historial de canjes
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

  async remove(id: number): Promise<void> {
    const cliente = await this.findById(id);
    await this.clienteRepository.update(id, { activo: false });
  }

  async activate(id: number): Promise<Cliente> {
    await this.clienteRepository.update(id, { activo: true });
    const cliente = await this.clienteRepository.findOne({ where: { id } });
    if (!cliente) {
      throw new NotFoundException(`Cliente con ID ${id} no encontrado`);
    }
    return cliente;
  }

  private async generateCodigoCorto(): Promise<string> {
    let codigo: string = '';
    let exists = true;

    while (exists) {
      // Generar código de 6 caracteres alfanuméricos
      codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const existingClient = await this.clienteRepository.findOne({
        where: { codigoCorto: codigo },
      });
      
      exists = !!existingClient;
    }

    return codigo;
  }

  async getEstadisticasCliente(id: number): Promise<any> {
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
}
