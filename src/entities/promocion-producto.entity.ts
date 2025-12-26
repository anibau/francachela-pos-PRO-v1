import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { PromocionUnificada } from './promocion-unificada.entity';
import { Producto } from './producto.entity';

/**
 * Entidad de relación entre promociones y productos
 * Reemplaza la lógica de productos en JSONB de combos
 */
@Entity('promocion_productos')
export class PromocionProducto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  promocionId: number;

  @Column()
  productoId: number;

  @Column('int', { 
    nullable: true,
    comment: 'Cantidad exacta requerida para PACK y COMBO'
  })
  cantidadExacta: number;

  @Column('int', { 
    nullable: true,
    comment: 'Cantidad mínima requerida para SIMPLE'
  })
  cantidadMinima: number;

  @Column({ 
    default: true,
    comment: 'Si es obligatorio para que aplique la promoción (usado en COMBO)'
  })
  obligatorio: boolean;

  // Relaciones
  @ManyToOne(() => PromocionUnificada, promocion => promocion.productos, {
    onDelete: 'CASCADE'
  })
  @JoinColumn({ name: 'promocionId' })
  promocion: PromocionUnificada;

  @ManyToOne(() => Producto, {
    eager: true
  })
  @JoinColumn({ name: 'productoId' })
  producto: Producto;
}
