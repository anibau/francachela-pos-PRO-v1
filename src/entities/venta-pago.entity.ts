import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn,
  Index
} from 'typeorm';
import { Venta } from './venta.entity';
import { MetodoPago } from '../common/enums';
import { decimalTransformer } from '../common/transformers/decimal.transformer';

/**
 * Entidad normalizada para métodos de pago de ventas
 * Reemplaza el campo JSONB metodosPageoUsados por una tabla relacional
 * 
 * BENEFICIOS:
 * - Queries eficientes para estadísticas
 * - Integridad referencial
 * - Soporte para auditoría granular
 * - Escalabilidad para reportes complejos
 */
@Entity('venta_pagos')
@Index(['ventaId', 'metodoPago']) // Índice compuesto para queries de estadísticas
@Index(['metodoPago', 'fechaRegistro']) // Índice para reportes por método y fecha
export class VentaPago {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Relación Many-to-One con Venta
   * Una venta puede tener múltiples pagos
   */
  @ManyToOne(() => Venta, venta => venta.pagos, { 
    onDelete: 'CASCADE',
    eager: false 
  })
  @JoinColumn({ name: 'ventaId' })
  venta: Venta;

  @Column('int', { comment: 'ID de la venta asociada' })
  @Index() // Índice para joins eficientes
  ventaId: number;

  /**
   * Método de pago utilizado
   * EFECTIVO, YAPE, PLIN, TARJETA
   */
  @Column({
    type: 'enum',
    enum: MetodoPago,
    comment: 'Método de pago utilizado'
  })
  metodoPago: MetodoPago;

  /**
   * Monto pagado con este método específico
   * Debe ser > 0 y la suma de todos los pagos debe igualar el total de la venta
   */
  @Column('decimal', { 
    precision: 10, 
    scale: 2, 
    transformer: decimalTransformer,
    comment: 'Monto pagado con este método'
  })
  monto: number;

  /**
   * Referencia opcional del pago
   * Ej: número de operación YAPE, voucher de tarjeta, etc.
   */
  @Column({ 
    nullable: true, 
    length: 100,
    comment: 'Referencia de transacción (para YAPE, PLIN, TARJETA)' 
  })
  referencia?: string;

  /**
   * Estado del pago individual
   * Permite manejar pagos pendientes o rechazados en el futuro
   */
  @Column({
    type: 'enum',
    enum: ['PENDIENTE', 'COMPLETADO', 'RECHAZADO', 'ANULADO'],
    default: 'COMPLETADO',
    comment: 'Estado del pago individual'
  })
  estado: 'PENDIENTE' | 'COMPLETADO' | 'RECHAZADO' | 'ANULADO';
  /**
   * Notas adicionales del pago
   * Para información específica del método de pago
   */
  @Column({ 
    nullable: true, 
    length: 200,
    comment: 'Notas adicionales del pago' 
  })
  notas?: string;

  /**
   * Timestamp de cuando se registró este pago específico
   * Útil para auditoría y análisis temporal
   */
  @CreateDateColumn({ comment: 'Fecha y hora de registro del pago' })
  fechaRegistro: Date;

  /**
   * Usuario que registró este pago
   * Para auditoría y trazabilidad
   */
  @Column({ 
    length: 50,
    comment: 'Usuario que registró el pago'
  })
  registradoPor: string;

  /**
   * Número de secuencia del pago dentro de la venta
   * Para mantener orden de los pagos (1, 2, 3, etc.)
   */
  @Column('int', { 
    default: 1,
    comment: 'Orden del pago dentro de la venta'
  })
  secuencia: number;
}
