import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Cliente } from './cliente.entity';
import { VentaPago } from './venta-pago.entity';
import { EstadoVenta, TipoCompra, MetodoPago } from '../common/enums';
import { decimalTransformer } from '../common/transformers/decimal.transformer';
import { MoneyUtil } from '../common/utils/money.util';

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

  @Column('decimal', { 
    precision: 10, 
    scale: 2, 
    default: 0, 
    transformer: decimalTransformer,
    comment: 'Recargo extra aplicado a la venta (opuesto al descuento)'
  })
  recargoExtra: number;

  @Column('decimal', { precision: 10, scale: 2, transformer: decimalTransformer })
  total: number;

  // Campo metodoPago eliminado - usar relación pagos[] en su lugar

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

  /**
   * Relación One-to-Many con VentaPago
   * Una venta puede tener múltiples métodos de pago
   * REEMPLAZA el campo metodosPageoUsados para normalización
   */
  @OneToMany(() => VentaPago, ventaPago => ventaPago.venta, {
    cascade: ['insert', 'update', 'remove'],
    eager: false // Cargar solo cuando sea necesario para performance
  })
  pagos: VentaPago[];

  // Campo metodosPageoUsados eliminado - usar relación pagos[] en su lugar

  /**
   * Estado de la venta completa
   * Calculado basado en el estado de todos los pagos asociados
   */
  @Column({
    type: 'enum',
    enum: ['PENDIENTE', 'COMPLETADO', 'RECHAZADO', 'PARCIAL'],
    default: 'COMPLETADO',
    comment: 'Estado general de la venta basado en sus pagos'
  })
  estadoVenta: 'PENDIENTE' | 'COMPLETADO' | 'RECHAZADO' | 'PARCIAL';

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  /**
   * Getter que calcula el total basado en subtotal, descuento y recargoExtra
   * Fórmula: total = subTotal - descuento + recargoExtra
   */
  get totalCalculado(): number {
    return this.subTotal - (this.descuento || 0) + (this.recargoExtra || 0);
  }

  /**
   * Getter que verifica si la suma de pagos coincide con el total
   * Utiliza tolerancia de 5 céntimos para permitir variaciones de redondeo
   * Más apropiado para un sistema POS
   */
  get esPagoCompleto(): boolean {
    if (!this.pagos || this.pagos.length === 0) return false;
    
    const sumaPagos = this.pagos
      .filter(p => p.estado === 'COMPLETADO')
      .reduce((sum, pago) => sum + pago.monto, 0);
    
    // Usar MoneyUtil para validación con tolerancia POS (5 céntimos)
    return MoneyUtil.isEqual(sumaPagos, this.total);
  }
}
