import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TipoPromocion } from '../common/enums';



@Entity('promociones')
export class Promocion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: TipoPromocion,
    default: TipoPromocion.SIMPLE,
  })
  tipo: TipoPromocion;

  @Column('decimal', { precision: 10, scale: 2 })
  descuento: number;

  @Column({ type: 'date' })
  fechaInicio: Date;

  @Column({ type: 'date' })
  fechaFin: Date;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: 'jsonb', default: [] })
  productosAplicables: number[]; // IDs de productos

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  montoMinimo: number;

  @Column('int', { nullable: true })
  cantidadMaximaUsos: number;

  @Column('int', { default: 0 })
  cantidadUsada: number;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}

