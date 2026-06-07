import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromocionUnificada } from '../../entities/promocion-unificada.entity';
import { PromocionProducto } from '../../entities/promocion-producto.entity';
import { CreatePromocionUnificadaDto } from './dto/create-promocion-unificada.dto';
import { UpdatePromocionUnificadaDto } from './dto/update-promocion-unificada.dto';
import { TipoPromocion } from '../../common/enums/tipo-promocion.enum';
import { TipoDescuento } from '../../common/enums/tipo-descuento.enum';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

/**
 * Servicio para gestión de promociones unificadas
 * Maneja SIMPLE, PACK y COMBO en un solo servicio
 */
@Injectable()
export class PromocionesUnificadasService {
  constructor(
    @InjectRepository(PromocionUnificada)
    private promocionRepository: Repository<PromocionUnificada>,
    @InjectRepository(PromocionProducto)
    private promocionProductoRepository: Repository<PromocionProducto>,
  ) {}

  /**
   * Crear nueva promoción unificada
   */
  async create(createDto: CreatePromocionUnificadaDto): Promise<PromocionUnificada> {
    // Validar coherencia del DTO según tipo de promoción
    this.validarCoherenciaDto(createDto);

    // Crear la promoción
    const promocion = this.promocionRepository.create({
      nombre: createDto.nombre,
      descripcion: createDto.descripcion,
      tipoPromocion: createDto.tipoPromocion,
      tipoDescuento: createDto.tipoDescuento,
      descuento: createDto.descuento,
      precioCombo: createDto.precioCombo,
      fechaInicio: new Date(createDto.fechaInicio),
      fechaFin: new Date(createDto.fechaFin),
      maxUsos: createDto.maxUsos,
      activo: createDto.activo ?? true,
      puntosExtra: createDto.puntosExtra ?? 0,
    });

    const promocionGuardada = await this.promocionRepository.save(promocion);

    // Crear relaciones con productos
    const productosRelacion = createDto.productosAplicables.map(producto => 
      this.promocionProductoRepository.create({
        promocionId: promocionGuardada.id,
        productoId: producto.productoId,
        cantidadExacta: producto.cantidadExacta,
        cantidadMinima: producto.cantidadMinima,
        obligatorio: producto.obligatorio ?? true,
      })
    );

    await this.promocionProductoRepository.save(productosRelacion);

    // Retornar promoción con productos
    return this.findById(promocionGuardada.id);
  }

  /**
   * Obtener todas las promociones
   */
  async findAll(
    paginationDto?: PaginationDto,
  ): Promise<PaginatedResult<PromocionUnificada>> {
    const { page, limit, skip } = paginationDto ?? new PaginationDto();

    const [data, total] = await this.promocionRepository.findAndCount({
      relations: ['productos', 'productos.producto'],
      order: { createdAt: 'DESC' },
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

  /**
   * Obtener promociones activas
   */
  async findActivas(): Promise<PromocionUnificada[]> {
    const ahora = new Date();
    
    return this.promocionRepository
      .createQueryBuilder('promocion')
      .leftJoinAndSelect('promocion.productos', 'productos')
      .leftJoinAndSelect('productos.producto', 'producto')
      .where('promocion.activo = :activo', { activo: true })
      .andWhere('promocion.fechaInicio <= :ahora', { ahora })
      .andWhere('promocion.fechaFin >= :ahora', { ahora })
      .orderBy('promocion.createdAt', 'DESC')
      .getMany();
  }

  /**
   * Obtener promociones por tipo
   */
  async findByTipo(tipo: TipoPromocion): Promise<PromocionUnificada[]> {
    return this.promocionRepository.find({
      where: { tipoPromocion: tipo },
      relations: ['productos', 'productos.producto'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Obtener promoción por ID
   */
  async findById(id: number): Promise<PromocionUnificada> {
    const promocion = await this.promocionRepository.findOne({
      where: { id },
      relations: ['productos', 'productos.producto'],
    });

    if (!promocion) {
      throw new NotFoundException(`Promoción con ID ${id} no encontrada`);
    }

    return promocion;
  }

  /**
   * Actualizar promoción
   */
  async update(id: number, updateDto: UpdatePromocionUnificadaDto): Promise<PromocionUnificada> {
    const promocion = await this.findById(id);

    // Validar coherencia si se están actualizando campos críticos
    if (updateDto.tipoPromocion || updateDto.tipoDescuento || updateDto.productosAplicables) {
      const dtoCompleto = { ...promocion, ...updateDto } as CreatePromocionUnificadaDto;
      this.validarCoherenciaDto(dtoCompleto);
    }

    // Actualizar campos básicos
    Object.assign(promocion, {
      nombre: updateDto.nombre ?? promocion.nombre,
      descripcion: updateDto.descripcion ?? promocion.descripcion,
      tipoPromocion: updateDto.tipoPromocion ?? promocion.tipoPromocion,
      tipoDescuento: updateDto.tipoDescuento ?? promocion.tipoDescuento,
      descuento: updateDto.descuento ?? promocion.descuento,
      precioCombo: updateDto.precioCombo ?? promocion.precioCombo,
      fechaInicio: updateDto.fechaInicio ? new Date(updateDto.fechaInicio) : promocion.fechaInicio,
      fechaFin: updateDto.fechaFin ? new Date(updateDto.fechaFin) : promocion.fechaFin,
      maxUsos: updateDto.maxUsos ?? promocion.maxUsos,
      activo: updateDto.activo ?? promocion.activo,
      puntosExtra: updateDto.puntosExtra ?? promocion.puntosExtra,
    });

    await this.promocionRepository.save(promocion);

    // Actualizar productos si se proporcionaron
    if (updateDto.productosAplicables) {
      // Eliminar productos existentes
      await this.promocionProductoRepository.delete({ promocionId: id });

      // Crear nuevos productos
      const productosRelacion = updateDto.productosAplicables.map(producto => 
        this.promocionProductoRepository.create({
          promocionId: id,
          productoId: producto.productoId,
          cantidadExacta: producto.cantidadExacta,
          cantidadMinima: producto.cantidadMinima,
          obligatorio: producto.obligatorio ?? true,
        })
      );

      await this.promocionProductoRepository.save(productosRelacion);
    }

    return this.findById(id);
  }

  /**
   * Activar promoción
   */
  async activate(id: number): Promise<PromocionUnificada> {
    const promocion = await this.findById(id);
    promocion.activo = true;
    await this.promocionRepository.save(promocion);
    return promocion;
  }

  /**
   * Desactivar promoción
   */
  async deactivate(id: number): Promise<PromocionUnificada> {
    const promocion = await this.findById(id);
    promocion.activo = false;
    await this.promocionRepository.save(promocion);
    return promocion;
  }

  /**
   * Eliminar promoción
   */
  async remove(id: number): Promise<void> {
    const promocion = await this.findById(id);
    await this.promocionRepository.remove(promocion);
  }

  /**
   * Validar coherencia del DTO según tipo de promoción
   */
  private validarCoherenciaDto(dto: CreatePromocionUnificadaDto): void {
    switch (dto.tipoPromocion) {
      case TipoPromocion.SIMPLE:
        this.validarPromocionSimple(dto);
        break;
      case TipoPromocion.PACK:
        this.validarPromocionPack(dto);
        break;
      case TipoPromocion.COMBO:
        this.validarPromocionCombo(dto);
        break;
    }
  }

  private validarPromocionSimple(dto: CreatePromocionUnificadaDto): void {
    // SIMPLE puede tener múltiples productos
    // Cada producto debe tener cantidadMinima
    for (const producto of dto.productosAplicables) {
      if (!producto.cantidadMinima) {
        throw new BadRequestException(
          'Promoción SIMPLE requiere cantidadMinima para cada producto'
        );
      }
    }
  }

  private validarPromocionPack(dto: CreatePromocionUnificadaDto): void {
    // PACK debe tener exactamente un producto
    if (dto.productosAplicables.length !== 1) {
      throw new BadRequestException(
        'Promoción PACK debe tener exactamente un producto'
      );
    }

    const producto = dto.productosAplicables[0];
    if (!producto.cantidadExacta) {
      throw new BadRequestException(
        'Promoción PACK requiere cantidadExacta para el producto'
      );
    }
  }

  private validarPromocionCombo(dto: CreatePromocionUnificadaDto): void {
    // COMBO debe tener múltiples productos con cantidades exactas
    if (dto.productosAplicables.length < 2) {
      throw new BadRequestException(
        'Promoción COMBO debe tener al menos 2 productos'
      );
    }

    for (const producto of dto.productosAplicables) {
      if (!producto.cantidadExacta) {
        throw new BadRequestException(
          'Promoción COMBO requiere cantidadExacta para cada producto'
        );
      }
    }

    // Si es PRECIO_FIJO, debe tener precioCombo
    if (dto.tipoDescuento === TipoDescuento.PRECIO_FIJO && !dto.precioCombo) {
      throw new BadRequestException(
        'Promoción COMBO con PRECIO_FIJO requiere precioCombo'
      );
    }
  }
}
