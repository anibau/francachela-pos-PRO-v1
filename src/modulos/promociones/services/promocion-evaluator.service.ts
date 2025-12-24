import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromocionUnificada } from '../../../entities/promocion-unificada.entity';
import { PromocionProducto } from '../../../entities/promocion-producto.entity';
import { TipoPromocion } from '../../../common/enums/tipo-promocion.enum';
import { TipoDescuento } from '../../../common/enums/tipo-descuento.enum';

export interface ItemCarrito {
  productoId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface CarritoCompras {
  items: ItemCarrito[];
  montoTotal: number;
}

export interface PromocionAplicada {
  id: number;
  nombre: string;
  tipo: TipoPromocion;
  descuento: number;
  tipoDescuento: TipoDescuento;
}

export interface ResultadoEvaluacion {
  promocionAplicada: PromocionAplicada | null;
  montoDescontado: number;
  precioFinal: number;
  detalles: {
    original: number;
    descuento: number;
    final: number;
  };
  puntosExtra: number;
}

/**
 * Servicio central para evaluación de promociones
 * Implementa las reglas de negocio para SIMPLE, PACK y COMBO
 */
@Injectable()
export class PromocionEvaluatorService {
  constructor(
    @InjectRepository(PromocionUnificada)
    private promocionRepository: Repository<PromocionUnificada>,
  ) {}

  /**
   * Evalúa qué promoción aplicar a un carrito de compras
   * @param carrito Carrito con items y monto total
   * @returns Resultado de la evaluación con promoción aplicada
   */
  async evaluarPromociones(carrito: CarritoCompras): Promise<ResultadoEvaluacion> {
    // Obtener promociones activas ordenadas por prioridad
    const promocionesActivas = await this.obtenerPromocionesActivas();

    let mejorPromocion: ResultadoEvaluacion | null = null;
    let mayorDescuento = 0;

    // Evaluar cada promoción y encontrar la mejor
    for (const promocion of promocionesActivas) {
      const resultado = await this.evaluarPromocionIndividual(promocion, carrito);
      
      if (resultado.montoDescontado > mayorDescuento) {
        mayorDescuento = resultado.montoDescontado;
        mejorPromocion = resultado;
      }
    }

    // Si no se encontró promoción aplicable, retornar sin descuento
    if (!mejorPromocion) {
      return {
        promocionAplicada: null,
        montoDescontado: 0,
        precioFinal: carrito.montoTotal,
        detalles: {
          original: carrito.montoTotal,
          descuento: 0,
          final: carrito.montoTotal,
        },
        puntosExtra: 0,
      };
    }

    return mejorPromocion;
  }

  /**
   * Obtiene promociones activas ordenadas por prioridad
   * Prioridad: COMBO > PACK > SIMPLE
   */
  private async obtenerPromocionesActivas(): Promise<PromocionUnificada[]> {
    const ahora = new Date();
    
    return await this.promocionRepository
      .createQueryBuilder('promocion')
      .leftJoinAndSelect('promocion.productos', 'productos')
      .leftJoinAndSelect('productos.producto', 'producto')
      .where('promocion.activo = :activo', { activo: true })
      .andWhere('promocion.fechaInicio <= :ahora', { ahora })
      .andWhere('promocion.fechaFin >= :ahora', { ahora })
      .andWhere('(promocion.maxUsos IS NULL OR promocion.usosActuales < promocion.maxUsos)')
      .orderBy('CASE promocion.tipoPromocion WHEN :combo THEN 1 WHEN :pack THEN 2 WHEN :simple THEN 3 END', 'ASC')
      .setParameters({
        combo: TipoPromocion.COMBO,
        pack: TipoPromocion.PACK,
        simple: TipoPromocion.SIMPLE,
      })
      .getMany();
  }

  /**
   * Evalúa una promoción individual contra el carrito
   */
  private async evaluarPromocionIndividual(
    promocion: PromocionUnificada,
    carrito: CarritoCompras,
  ): Promise<ResultadoEvaluacion> {
    let montoDescontado = 0;
    let precioFinal = carrito.montoTotal;

    switch (promocion.tipoPromocion) {
      case TipoPromocion.SIMPLE:
        montoDescontado = this.evaluarPromocionSimple(promocion, carrito);
        break;
      case TipoPromocion.PACK:
        montoDescontado = this.evaluarPromocionPack(promocion, carrito);
        break;
      case TipoPromocion.COMBO:
        montoDescontado = this.evaluarPromocionCombo(promocion, carrito);
        break;
    }

    precioFinal = Math.max(0, carrito.montoTotal - montoDescontado);

    return {
      promocionAplicada: montoDescontado > 0 ? {
        id: promocion.id,
        nombre: promocion.nombre,
        tipo: promocion.tipoPromocion,
        descuento: promocion.descuento,
        tipoDescuento: promocion.tipoDescuento,
      } : null,
      montoDescontado,
      precioFinal,
      detalles: {
        original: carrito.montoTotal,
        descuento: montoDescontado,
        final: precioFinal,
      },
      puntosExtra: montoDescontado > 0 ? promocion.puntosExtra : 0,
    };
  }

  /**
   * Evalúa promoción SIMPLE: descuento si el producto está en el carrito
   */
  private evaluarPromocionSimple(promocion: PromocionUnificada, carrito: CarritoCompras): number {
    let descuentoTotal = 0;

    for (const promocionProducto of promocion.productos) {
      const itemCarrito = carrito.items.find(item => item.productoId === promocionProducto.productoId);
      
      if (itemCarrito && itemCarrito.cantidad >= (promocionProducto.cantidadMinima || 1)) {
        const montoProducto = itemCarrito.cantidad * itemCarrito.precioUnitario;
        
        switch (promocion.tipoDescuento) {
          case TipoDescuento.PORCENTAJE:
            descuentoTotal += montoProducto * (promocion.descuento / 100);
            break;
          case TipoDescuento.MONTO_FIJO:
            descuentoTotal += promocion.descuento;
            break;
          case TipoDescuento.PRECIO_FIJO:
            descuentoTotal += Math.max(0, montoProducto - promocion.descuento);
            break;
        }
      }
    }

    return descuentoTotal;
  }

  /**
   * Evalúa promoción PACK: descuento por cantidad específica de un producto
   */
  private evaluarPromocionPack(promocion: PromocionUnificada, carrito: CarritoCompras): number {
    // Para PACK debe haber exactamente un producto en la promoción
    if (promocion.productos.length !== 1) {
      return 0;
    }

    const promocionProducto = promocion.productos[0];
    const itemCarrito = carrito.items.find(item => item.productoId === promocionProducto.productoId);

    if (!itemCarrito || itemCarrito.cantidad < promocionProducto.cantidadExacta) {
      return 0;
    }

    // Calcular cuántos packs completos se pueden formar
    const packsCompletos = Math.floor(itemCarrito.cantidad / promocionProducto.cantidadExacta);
    const montoPorPack = promocionProducto.cantidadExacta * itemCarrito.precioUnitario;

    let descuentoPorPack = 0;
    switch (promocion.tipoDescuento) {
      case TipoDescuento.PORCENTAJE:
        descuentoPorPack = montoPorPack * (promocion.descuento / 100);
        break;
      case TipoDescuento.MONTO_FIJO:
        descuentoPorPack = promocion.descuento;
        break;
      case TipoDescuento.PRECIO_FIJO:
        descuentoPorPack = Math.max(0, montoPorPack - promocion.descuento);
        break;
    }

    return packsCompletos * descuentoPorPack;
  }

  /**
   * Evalúa promoción COMBO: precio fijo para conjunto específico de productos
   */
  private evaluarPromocionCombo(promocion: PromocionUnificada, carrito: CarritoCompras): number {
    // Verificar que todos los productos del combo estén en el carrito con cantidades exactas
    const productosRequeridos = promocion.productos.filter(p => p.obligatorio);
    
    if (productosRequeridos.length === 0) {
      return 0;
    }

    // Encontrar el número máximo de combos que se pueden formar
    let combosCompletos = Infinity;
    let montoTotalCombo = 0;

    for (const promocionProducto of productosRequeridos) {
      const itemCarrito = carrito.items.find(item => item.productoId === promocionProducto.productoId);
      
      if (!itemCarrito || itemCarrito.cantidad < promocionProducto.cantidadExacta) {
        return 0; // No se puede formar el combo
      }

      const combosDisponibles = Math.floor(itemCarrito.cantidad / promocionProducto.cantidadExacta);
      combosCompletos = Math.min(combosCompletos, combosDisponibles);
      
      // Acumular el monto total del combo
      montoTotalCombo += promocionProducto.cantidadExacta * itemCarrito.precioUnitario;
    }

    if (combosCompletos === 0 || combosCompletos === Infinity) {
      return 0;
    }

    // Para COMBO, normalmente se usa PRECIO_FIJO
    if (promocion.tipoDescuento === TipoDescuento.PRECIO_FIJO && promocion.precioCombo) {
      const descuentoPorCombo = Math.max(0, montoTotalCombo - promocion.precioCombo);
      return combosCompletos * descuentoPorCombo;
    }

    // Otros tipos de descuento para combo
    switch (promocion.tipoDescuento) {
      case TipoDescuento.PORCENTAJE:
        return combosCompletos * montoTotalCombo * (promocion.descuento / 100);
      case TipoDescuento.MONTO_FIJO:
        return combosCompletos * promocion.descuento;
      default:
        return 0;
    }
  }

  /**
   * Marca una promoción como usada (incrementa contador)
   */
  async marcarPromocionUsada(promocionId: number): Promise<void> {
    await this.promocionRepository
      .createQueryBuilder()
      .update(PromocionUnificada)
      .set({ usosActuales: () => 'usos_actuales + 1' })
      .where('id = :id', { id: promocionId })
      .execute();
  }
}
