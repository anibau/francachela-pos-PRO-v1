import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Caja, EstadoCaja } from '../../entities/caja.entity';
import { Venta } from '../../entities/venta.entity';
import { EstadoVenta } from '../../common/enums';
import { Gasto } from '../../entities/gasto.entity';
import { AbrirCajaDto } from './dto/abrir-caja.dto';
import { CerrarCajaDto } from './dto/cerrar-caja.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class CajaService {
  constructor(
    @InjectRepository(Caja)
    private cajaRepository: Repository<Caja>,
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    @InjectRepository(Gasto)
    private gastoRepository: Repository<Gasto>,
  ) {}

  async abrirCaja(abrirCajaDto: AbrirCajaDto, cajero: string): Promise<Caja> {
    // Verificar que no haya una caja abierta
    const cajaAbierta = await this.getCajaAbierta(cajero);
    if (cajaAbierta) {
      throw new BadRequestException('Ya existe una caja abierta para este cajero');
    }

    const caja = this.cajaRepository.create({
      ...abrirCajaDto,
      cajero,
      estado: EstadoCaja.ABIERTA,
      fechaApertura: new Date(),
    });

    return this.cajaRepository.save(caja);
  }

  async cerrarCaja(id: number, cerrarCajaDto: CerrarCajaDto): Promise<Caja> {
    const caja = await this.findById(id);

    if (caja.estado === EstadoCaja.CERRADA) {
      throw new BadRequestException('La caja ya está cerrada');
    }

    // Calcular totales del día
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
      estado: EstadoCaja.CERRADA,
    });

    return this.findById(id);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Caja>> {
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

  async findById(id: number): Promise<Caja> {
    const caja = await this.cajaRepository.findOne({ where: { id } });
    if (!caja) {
      throw new NotFoundException('Caja no encontrada');
    }
    return caja;
  }

  async getCajaAbierta(cajero?: string): Promise<Caja | null> {
    const whereCondition: any = { estado: EstadoCaja.ABIERTA };
    if (cajero) {
      whereCondition.cajero = cajero;
    }

    return this.cajaRepository.findOne({ where: whereCondition });
  }

  async getCajaActual(cajero: string): Promise<Caja> {
    const caja = await this.getCajaAbierta(cajero);
    if (!caja) {
      throw new NotFoundException('No hay una caja abierta para este cajero');
    }
    return caja;
  }

  async getResumenCajaActual(cajero: string): Promise<any> {
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

  private async calcularTotalesCaja(caja: Caja): Promise<{
    totalVentas: number;
    totalGastos: number;
    desglosePorMetodo: any;
  }> {
    const fechaInicio = caja.fechaApertura;
    const fechaFin = caja.fechaCierre || new Date();

    // Calcular ventas
    const ventas = await this.ventaRepository.find({
      where: {
        fecha: Between(fechaInicio, fechaFin),
        cajero: caja.cajero,
        estado: EstadoVenta.COMPLETADO,
      },
    });

    const totalVentas = ventas.reduce((sum, venta) => sum + venta.total, 0);

    // Desglose por método de pago
    const desglosePorMetodo = ventas.reduce((acc, venta) => {
      acc[venta.metodoPago] = (acc[venta.metodoPago] || 0) + venta.total;
      return acc;
    }, {});

    // Calcular gastos
    const gastos = await this.gastoRepository.find({
      where: {
        fecha: Between(fechaInicio, fechaFin),
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

  async getCajasPorFecha(fechaInicio: Date, fechaFin: Date): Promise<Caja[]> {
    return this.cajaRepository.find({
      where: {
        fechaApertura: Between(fechaInicio, fechaFin),
      },
      order: { fechaApertura: 'DESC' },
    });
  }

  async getEstadisticasCajas(fechaInicio: Date, fechaFin: Date): Promise<any> {
    const cajas = await this.getCajasPorFecha(fechaInicio, fechaFin);

    const totalCajas = cajas.length;
    const cajasAbiertas = cajas.filter(c => c.estado === EstadoCaja.ABIERTA).length;
    const cajasCerradas = cajas.filter(c => c.estado === EstadoCaja.CERRADA).length;

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
}
