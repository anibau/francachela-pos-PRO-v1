import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('combos')
export class Combo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ type: 'jsonb' })
  productos: any[]; // { id, codigoBarra, descripcion, cantidad, precio }

  @Column('decimal', { precision: 10, scale: 2 })
  precioOriginal: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precioCombo: number;

  @Column('int', { default: 0 })
  puntosExtra: number;

  @Column({ default: true })
  activo: boolean;

  @Column({ nullable: true })
  imagen: string;

  @Column({ type: 'date', nullable: true })
  fechaInicio: Date;

  @Column({ type: 'date', nullable: true })
  fechaFin: Date;

  @Column('int', { nullable: true })
  stockDisponible: number;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  // Computed property
  get descuentoCombo(): number {
    return this.precioOriginal - this.precioCombo;
  }

  get porcentajeDescuento(): number {
    return ((this.precioOriginal - this.precioCombo) / this.precioOriginal) * 100;
  }
}

