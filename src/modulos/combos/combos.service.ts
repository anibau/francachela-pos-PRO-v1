import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Combo } from '../../entities/combo.entity';
import { Producto } from '../../entities/producto.entity';
import { CreateComboDto } from './dto/create-combo.dto';
import { UpdateComboDto } from './dto/update-combo.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class CombosService {
  constructor(
    @InjectRepository(Combo)
    private comboRepository: Repository<Combo>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) {}

  async create(createComboDto: CreateComboDto): Promise<Combo> {
    // Validar que todos los productos existen
    const productosIds = createComboDto.productos.map(p => p.productoId);
    const productos = await this.productoRepository.findByIds(productosIds);
    
    if (productos.length !== productosIds.length) {
      throw new BadRequestException('Uno o más productos no existen');
    }

    // Validar que el precio del combo sea menor al precio original
    if (createComboDto.precioCombo >= createComboDto.precioOriginal) {
      throw new BadRequestException('El precio del combo debe ser menor al precio original');
    }

    const combo = this.comboRepository.create(createComboDto);
    return this.comboRepository.save(combo);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Combo>> {
    const { page, limit, skip } = paginationDto;

    const [data, total] = await this.comboRepository.findAndCount({
      skip,
      take: limit,
      order: { nombre: 'ASC' },
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

  async findById(id: number): Promise<Combo> {
    const combo = await this.comboRepository.findOne({ where: { id } });
    if (!combo) {
      throw new NotFoundException('Combo no encontrado');
    }
    return combo;
  }

  async findActivos(paginationDto: PaginationDto): Promise<PaginatedResult<Combo>> {
    const { page, limit, skip } = paginationDto;

    const [data, total] = await this.comboRepository.findAndCount({
      where: { activo: true },
      skip,
      take: limit,
      order: { nombre: 'ASC' },
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

  async update(id: number, updateComboDto: UpdateComboDto): Promise<Combo> {
    const combo = await this.findById(id);

    // Si se actualizan productos, validar que existen
    if (updateComboDto.productos) {
      const productosIds = updateComboDto.productos.map(p => p.productoId);
      const productos = await this.productoRepository.findByIds(productosIds);
      
      if (productos.length !== productosIds.length) {
        throw new BadRequestException('Uno o más productos no existen');
      }
    }

    // Validar precios si se actualizan
    const precioOriginal = updateComboDto.precioOriginal || combo.precioOriginal;
    const precioCombo = updateComboDto.precioCombo || combo.precioCombo;
    
    if (precioCombo >= precioOriginal) {
      throw new BadRequestException('El precio del combo debe ser menor al precio original');
    }

    // Separar productos del resto de datos
    const { productos, ...updateData } = updateComboDto;
    
    // Actualizar datos básicos del combo
    await this.comboRepository.update(id, updateData);
    
    // Si se proporcionaron productos, actualizar la entidad completa
    if (productos) {
      combo.productos = productos;
      await this.comboRepository.save(combo);
    }
    
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.comboRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Combo no encontrado');
    }
  }

  async activate(id: number): Promise<Combo> {
    await this.comboRepository.update(id, { activo: true });
    return this.findById(id);
  }

  async deactivate(id: number): Promise<Combo> {
    await this.comboRepository.update(id, { activo: false });
    return this.findById(id);
  }

  async verificarDisponibilidad(comboId: number): Promise<{ disponible: boolean, productosNoDisponibles: string[] }> {
    const combo = await this.findById(comboId);
    
    if (!combo.activo) {
      return { disponible: false, productosNoDisponibles: ['Combo inactivo'] };
    }

    const productosNoDisponibles: string[] = [];

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

  async calcularAhorro(comboId: number): Promise<{ ahorro: number, porcentajeDescuento: number }> {
    const combo = await this.findById(comboId);
    
    const ahorro = combo.precioOriginal - combo.precioCombo;
    const porcentajeDescuento = (ahorro / combo.precioOriginal) * 100;

    return { ahorro, porcentajeDescuento };
  }

  async getCombosPopulares(limit: number = 10): Promise<any[]> {
    // Esta funcionalidad requeriría tracking de ventas de combos
    // Por ahora retornamos los combos activos ordenados por nombre
    const combos = await this.comboRepository.find({
      where: { activo: true },
      take: limit,
      order: { nombre: 'ASC' }
    });

    return combos.map(combo => ({
      ...combo,
      ahorro: combo.precioOriginal - combo.precioCombo,
      porcentajeDescuento: ((combo.precioOriginal - combo.precioCombo) / combo.precioOriginal) * 100
    }));
  }
}
