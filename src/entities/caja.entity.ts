import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EstadoCaja {
  ABIERTA = 'ABIERTA',
  CERRADA = 'CERRADA',
}

@Entity('caja')
export class Caja {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  fechaApertura: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaCierre: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  montoInicial: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalVentas: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalGastos: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  montoFinal: number;

  @Column()
  cajero: string;

  @Column({
    type: 'enum',
    enum: EstadoCaja,
    default: EstadoCaja.ABIERTA,
  })
  estado: EstadoCaja;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  diferencia: number;

  @Column({ type: 'jsonb', default: {} })
  desglosePorMetodo: any; // { EFECTIVO: 0, YAPE: 0, PLIN: 0, TARJETA: 0 }

  @Column({ nullable: true })
  observaciones: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  // Computed property
  get montoEsperado(): number {
    return this.montoInicial + this.totalVentas - this.totalGastos;
  }
}

