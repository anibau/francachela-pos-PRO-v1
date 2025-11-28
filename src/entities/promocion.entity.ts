import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TipoPromocion {
  PORCENTAJE = 'PORCENTAJE',
  MONTO = 'MONTO',
  DOS_POR_UNO = '2X1',
  TRES_POR_DOS = '3X2',
}

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
    default: TipoPromocion.PORCENTAJE,
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

