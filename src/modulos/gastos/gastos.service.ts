import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Gasto } from '../../entities/gasto.entity';
import { CategoriaGasto } from '../../common/enums';
import { CreateGastoDto } from './dto/create-gasto.dto';
import { UpdateGastoDto } from './dto/update-gasto.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class GastosService {
  constructor(
    @InjectRepository(Gasto)
    private gastoRepository: Repository<Gasto>,
  ) {}

  async create(createGastoDto: CreateGastoDto, cajero: string): Promise<Gasto> {
    const gasto = this.gastoRepository.create({
      ...createGastoDto,
      cajero,
    });

    return this.gastoRepository.save(gasto);
  }

  async findAll(): Promise<Gasto[]> {
    return this.gastoRepository.find({
      order: { fecha: 'DESC' },
    });
  }

  async findById(id: number): Promise<Gasto> {
    const gasto = await this.gastoRepository.findOne({ where: { id } });
    if (!gasto) {
      throw new NotFoundException('Gasto no encontrado');
    }
    return gasto;
  }

  async findByDateRange(fechaInicio: Date, fechaFin: Date, paginationDto: PaginationDto): Promise<PaginatedResult<Gasto>> {
    const { page, limit, skip } = paginationDto;

    const [data, total] = await this.gastoRepository.findAndCount({
      where: {
        fecha: Between(fechaInicio, fechaFin),
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

  async findByCategoria(categoria: CategoriaGasto, paginationDto: PaginationDto): Promise<PaginatedResult<Gasto>> {
    const { page, limit, skip } = paginationDto;

    const [data, total] = await this.gastoRepository.findAndCount({
      where: { categoria },
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

  async findByCajero(cajero: string, paginationDto: PaginationDto): Promise<PaginatedResult<Gasto>> {
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

  async search(query: string, paginationDto: PaginationDto): Promise<PaginatedResult<Gasto>> {
    const { page, limit, skip } = paginationDto;

    const [data, total] = await this.gastoRepository.findAndCount({
      where: [
        { descripcion: Like(`%${query}%`) },
        { proveedor: Like(`%${query}%`) },
        { numeroComprobante: Like(`%${query}%`) },
      ],
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

  async update(id: number, updateGastoDto: UpdateGastoDto): Promise<Gasto> {
    await this.gastoRepository.update(id, updateGastoDto);
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.gastoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Gasto no encontrado');
    }
  }

  async getGastosDelDia(): Promise<{ gastos: Gasto[], totalGastos: number, totalMonto: number }> {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const gastos = await this.gastoRepository.find({
      where: {
        fecha: Between(startOfDay, endOfDay),
      },
      order: { fecha: 'DESC' },
    });

    const totalGastos = gastos.length;
    const totalMonto = gastos.reduce((sum, gasto) => sum + gasto.monto, 0);

    return { gastos, totalGastos, totalMonto };
  }

  async getEstadisticasGastos(fechaInicio: Date, fechaFin: Date): Promise<any> {
    const gastos = await this.gastoRepository.find({
      where: {
        fecha: Between(fechaInicio, fechaFin),
      },
    });

    const totalGastos = gastos.length;
    // Asegurar que monto sea un número usando parseFloat
    const totalMonto = gastos.reduce((sum, gasto) => {
      const gastoMonto = typeof gasto.monto === 'string' ? parseFloat(gasto.monto) : gasto.monto;
      return sum + (isNaN(gastoMonto) ? 0 : gastoMonto);
    }, 0);
    const promedioGasto = totalGastos > 0 ? totalMonto / totalGastos : 0;

    // Agrupar por categoría - asegurar operaciones numéricas
    const gastosPorCategoria = gastos.reduce((acc, gasto) => {
      const gastoMonto = typeof gasto.monto === 'string' ? parseFloat(gasto.monto) : gasto.monto;
      const montoNumerico = isNaN(gastoMonto) ? 0 : gastoMonto;
      acc[gasto.categoria] = (acc[gasto.categoria] || 0) + montoNumerico;
      return acc;
    }, {});

    // Agrupar por método de pago - asegurar operaciones numéricas
    const gastosPorMetodo = gastos.reduce((acc, gasto) => {
      const gastoMonto = typeof gasto.monto === 'string' ? parseFloat(gasto.monto) : gasto.monto;
      const montoNumerico = isNaN(gastoMonto) ? 0 : gastoMonto;
      acc[gasto.metodoPago] = (acc[gasto.metodoPago] || 0) + montoNumerico;
      return acc;
    }, {});

    // Top proveedores - asegurar operaciones numéricas
    const gastosPorProveedor = gastos.reduce((acc, gasto) => {
      if (gasto.proveedor) {
        const gastoMonto = typeof gasto.monto === 'string' ? parseFloat(gasto.monto) : gasto.monto;
        const montoNumerico = isNaN(gastoMonto) ? 0 : gastoMonto;
        acc[gasto.proveedor] = (acc[gasto.proveedor] || 0) + montoNumerico;
      }
      return acc;
    }, {});

    const topProveedores = Object.entries(gastosPorProveedor)
      .map(([proveedor, monto]: [string, any]) => ({ proveedor, monto }))
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

  async getCategorias(): Promise<string[]> {
    return Object.values(CategoriaGasto);
  }
}
