import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
} from 'typeorm';

@Entity('config_puntos')
export class ConfigPuntos {
  @PrimaryGeneratedColumn()
  id: number;

  /** Valor en soles de cada punto al canjear (default 0.10) */
  @Column({ type: 'decimal', precision: 10, scale: 4, default: 0.1 })
  valorPunto: number;

  /** Máximo % del subtotal por producto canjeable con puntos (0-1, default 0.5) */
  @Column({ type: 'decimal', precision: 5, scale: 4, default: 0.5 })
  limiteCanjePorcentaje: number;

  /** Puntos otorgados = floor(totalCobrado × factor) (default 1) */
  @Column({ type: 'decimal', precision: 10, scale: 4, default: 1 })
  factorOtorgamiento: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string;
}
