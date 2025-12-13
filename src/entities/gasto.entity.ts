import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { MetodoPago, CategoriaGasto } from '../common/enums';
import { decimalTransformer } from '../common/transformers/decimal.transformer';

@Entity('gastos')
export class Gasto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column()
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2, transformer: decimalTransformer })
  monto: number;

  @Column({
    type: 'enum',
    enum: CategoriaGasto,
    default: CategoriaGasto.OTROS,
  })
  categoria: CategoriaGasto;

  @Column()
  cajero: string;

  @Column({ nullable: true })
  comprobante: string;

  @Column({
    type: 'enum',
    enum: MetodoPago,
    default: MetodoPago.EFECTIVO,
  })
  metodoPago: MetodoPago;

  @Column({ nullable: true })
  proveedor: string;

  @Column({ nullable: true })
  numeroComprobante: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
