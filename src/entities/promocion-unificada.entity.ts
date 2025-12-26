import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { TipoPromocion } from '../common/enums/tipo-promocion.enum';
import { TipoDescuento } from '../common/enums/tipo-descuento.enum';
import { PromocionProducto } from './promocion-producto.entity';

/**
 * Entidad unificada para promociones que reemplaza tanto Combo como Promocion
 * Soporta tres tipos: SIMPLE, PACK y COMBO
 */
@Entity('promociones')
export class PromocionUnificada {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: TipoPromocion,
    comment: 'SIMPLE: descuento individual, PACK: cantidad específica, COMBO: precio fijo conjunto'
  })
  tipoPromocion: TipoPromocion;

  @Column({
    type: 'enum',
    enum: TipoDescuento,
    comment: 'PORCENTAJE: %, MONTO_FIJO: cantidad fija, PRECIO_FIJO: precio total'
  })
  tipoDescuento: TipoDescuento;

  @Column('decimal', { 
    precision: 10, 
    scale: 2,
    comment: 'Valor del descuento (porcentaje o monto según tipoDescuento)'
  })
  descuento: number;

  @Column('decimal', { 
    precision: 10, 
    scale: 2, 
    nullable: true,
    comment: 'Precio fijo para COMBO (solo cuando tipoDescuento = PRECIO_FIJO)'
  })
  precioCombo: number;

  @Column({ type: 'date' })
  fechaInicio: Date;

  @Column({ type: 'date' })
  fechaFin: Date;

  @Column('int', { 
    nullable: true,
    comment: 'Límite máximo de usos de la promoción'
  })
  maxUsos: number;

  @Column('int', { 
    default: 0,
    comment: 'Contador de usos actuales'
  })
  usosActuales: number;

  @Column({ default: true })
  activo: boolean;

  @Column('int', { 
    default: 0,
    comment: 'Puntos extra otorgados por esta promoción'
  })
  puntosExtra: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relación con productos aplicables
  @OneToMany(() => PromocionProducto, promocionProducto => promocionProducto.promocion, {
    cascade: true,
    eager: true
  })
  productos: PromocionProducto[];

  // Computed properties para compatibilidad
  get esActiva(): boolean {
    const ahora = new Date();
    return this.activo && 
           ahora >= this.fechaInicio && 
           ahora <= this.fechaFin &&
           (this.maxUsos === null || this.usosActuales < this.maxUsos);
  }

  get porcentajeDescuento(): number {
    if (this.tipoDescuento === TipoDescuento.PORCENTAJE) {
      return this.descuento;
    }
    return 0;
  }

  get montoDescuento(): number {
    if (this.tipoDescuento === TipoDescuento.MONTO_FIJO) {
      return this.descuento;
    }
    return 0;
  }
}
