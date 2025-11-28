import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TipoMovimiento } from '../common/enums';

@Entity('movimientos_inventario')
export class MovimientoInventario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  hora: Date;

  @Column()
  codigoBarra: string;

  @Column()
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2 })
  costo: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precioVenta: number;

  @Column('int')
  existenciaAnterior: number;

  @Column('int')
  existenciaNueva: number;

  @Column('int')
  existencia: number; // Alias para compatibilidad

  @Column('int')
  invMinimo: number;

  @Column({
    type: 'enum',
    enum: TipoMovimiento,
    default: TipoMovimiento.AJUSTE,
  })
  tipo: TipoMovimiento;

  @Column('int')
  cantidad: number;

  @Column()
  cajero: string;

  @Column({ nullable: true })
  proveedor: string;

  @Column({ nullable: true })
  numeroFactura: string;

  @Column({ nullable: true })
  observaciones: string;

  @Column({ nullable: true })
  ventaId: number; // Referencia a la venta si es por venta

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
