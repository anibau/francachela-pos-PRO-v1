import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, And, FindOptionsWhere, Equal } from 'typeorm';
import { Promocion } from '../../entities/promocion.entity';
import { TipoPromocion } from '../../common/enums';
import { CreatePromocionDto } from './dto/create-promocion.dto';
import { UpdatePromocionDto } from './dto/update-promocion.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class PromocionesService {
  constructor(
    @InjectRepository(Promocion)
    private promocionRepository: Repository<Promocion>,
  ) {}

  async create(createPromocionDto: CreatePromocionDto): Promise<Promocion> {
    const promocion = this.promocionRepository.create(createPromocionDto);
    return this.promocionRepository.save(promocion);
  }

  async findAll(): Promise<Promocion[]> {
    return this.promocionRepository.find({
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findById(id: number): Promise<Promocion> {
    const promocion = await this.promocionRepository.findOne({ where: { id } });
    if (!promocion) {
      throw new NotFoundException('Promoción no encontrada');
    }
    return promocion;
  }

  async findActivas(): Promise<Promocion[]> {
    const today = new Date();
    return this.promocionRepository.find({
      where: {
        activo: true,
        fechaInicio: LessThanOrEqual(today),
        fechaFin: MoreThanOrEqual(today),
      },
      order: { fechaCreacion: 'DESC' },
    });
  }

  async findByTipo(tipo: TipoPromocion): Promise<Promocion[]> {
  const where: FindOptionsWhere<Promocion> = {
    tipo: Equal(tipo),
    activo: true,
  };

  return this.promocionRepository.find({
    where,
    order: { fechaCreacion: 'DESC' },
  });
}

  async update(id: number, updatePromocionDto: UpdatePromocionDto): Promise<Promocion> {
    await this.promocionRepository.update(id, updatePromocionDto);
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    await this.promocionRepository.update(id, { activo: false });
  }

  async activate(id: number): Promise<Promocion> {
    await this.promocionRepository.update(id, { activo: true });
    return this.findById(id);
  }

  async aplicarPromocion(promocionId: number, montoCompra: number): Promise<{ descuento: number, aplicable: boolean }> {
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

    // switch (promocion.tipo) {
    //   case TipoPromocion.PORCENTAJE:
    //     descuento = (montoCompra * promocion.descuento) / 100;
    //     break;
    //   case TipoPromocion.MONTO:
    //     descuento = promocion.descuento;
    //     break;
    //   case TipoPromocion.DOS_POR_UNO:
    //   case TipoPromocion.TRES_POR_DOS:
    //     // Estos se manejan a nivel de productos específicos
    //     descuento = 0;
    //     break;
    // }

    // Incrementar contador de usos
    await this.promocionRepository.update(promocionId, {
      cantidadUsada: promocion.cantidadUsada + 1,
    });

    return { descuento, aplicable: true };
  }

  async getPromocionesVencidas(): Promise<Promocion[]> {
    const today = new Date();
    return this.promocionRepository.find({
      where: {
        activo: true,
        fechaFin: LessThanOrEqual(today),
      },
    });
  }

  async desactivarVencidas(): Promise<number> {
    const promocionesVencidas = await this.getPromocionesVencidas();
    
    for (const promocion of promocionesVencidas) {
      await this.promocionRepository.update(promocion.id, { activo: false });
    }

    return promocionesVencidas.length;
  }
}
