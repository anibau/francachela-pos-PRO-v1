import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Cliente } from './cliente.entity';
import { EstadoVenta, TipoCompra, MetodoPago } from '../common/enums';
import { decimalTransformer } from '../common/transformers/decimal.transformer';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @ManyToOne(() => Cliente, { nullable: true, eager: true })
  @JoinColumn({ name: 'clienteId' })
  cliente: Cliente;

  @Column({ nullable: true })
  clienteId: number;

  @Column({ type: 'jsonb' })
  listaProductos: any[]; // { id, codigoBarra, descripcion, cantidad, precio, subtotal }

  @Column('decimal', { precision: 10, scale: 2, transformer: decimalTransformer })
  subTotal: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0, transformer: decimalTransformer })
  descuento: number;

  @Column('decimal', { precision: 10, scale: 2, transformer: decimalTransformer })
  total: number;

  @Column({
    type: 'enum',
    enum: MetodoPago,
    default: MetodoPago.EFECTIVO,
  })
  metodoPago: MetodoPago;

  @Column({ nullable: true })
  comentario: string;

  @Column()
  cajero: string;

  @Column({
    type: 'enum',
    enum: EstadoVenta,
    default: EstadoVenta.COMPLETADO,
  })
  estado: EstadoVenta;

  @Column('int', { default: 0 })
  puntosOtorgados: number;

  @Column('int', { default: 0 })
  puntosUsados: number;

  @Column({ nullable: true })
  ticketId: string;

  @Column({
    type: 'enum',
    enum: TipoCompra,
    default: TipoCompra.LOCAL,
  })
  tipoCompra: TipoCompra;

  @Column('decimal', { precision: 10, scale: 2, default: 0, transformer: decimalTransformer })
  montoRecibido: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0, transformer: decimalTransformer })
  vuelto: number;

  @Column({ 
    type: 'jsonb', 
    default: [],
    comment: 'Array de métodos de pago utilizados: [{ metodoPago, monto, referencia?, timestamp }]'
  })
  metodosPageoUsados: {
    metodoPago: MetodoPago;
    monto: number;
    referencia?: string;
    timestamp: Date;
  }[];

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
