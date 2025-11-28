import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Cliente } from './cliente.entity';

export enum EstadoDelivery {
  PENDIENTE = 'PENDIENTE',
  EN_PREPARACION = 'EN_PREPARACION',
  EN_CAMINO = 'EN_CAMINO',
  ENTREGADO = 'ENTREGADO',
  CANCELADO = 'CANCELADO',
}

@Entity('delivery')
export class Delivery {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @ManyToOne(() => Cliente, { nullable: true, eager: true })
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @Column({ nullable: true })
  clienteId: number;

  @Column()
  pedidoId: number; // Referencia a la venta

  @Column()
  direccion: string;

  @Column({
    type: 'enum',
    enum: EstadoDelivery,
    default: EstadoDelivery.PENDIENTE,
  })
  estado: EstadoDelivery;

  @Column()
  repartidor: string;

  @Column({ nullable: true })
  horaSalida: string;

  @Column({ nullable: true })
  horaEntrega: string;

  @Column({ nullable: true })
  saleId: number;

  @Column({ nullable: true })
  phone: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  deliveryFee: number;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  coordenadas: string; // lat,lng

  @Column('int', { nullable: true })
  tiempoEstimado: number; // minutos

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}

