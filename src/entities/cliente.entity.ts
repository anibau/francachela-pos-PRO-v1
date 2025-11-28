import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column({ unique: true })
  dni: string;

  @Column({ type: 'date', nullable: true })
  fechaNacimiento: Date;

  @Column({ nullable: true })
  telefono: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaRegistro: Date;

  @Column('int', { default: 0 })
  puntosAcumulados: number;

  @Column({ type: 'jsonb', default: [] })
  historialCompras: any[];

  @Column({ type: 'jsonb', default: [] })
  historialCanjes: any[];

  @Column({ nullable: true })
  codigoCorto: string;

  @Column({ nullable: true })
  direccion: string;

  @Column({ default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;

  // Computed property
  get nombreCompleto(): string {
    return `${this.nombres} ${this.apellidos}`;
  }
}

