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
  fechaNacimiento: string;

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

  /**
   * Getter que calcula si hoy es el cumpleaños del cliente
   */
  get esCumpleañosHoy(): boolean {
  if (!this.fechaNacimiento) return false;

  const[, mes, dia]= this.fechaNacimiento.split('-').map(Number);
  const hoy= new Date();
  const hoyMes= hoy.getMonth()+1;
  const hoyDia= hoy.getDate();

  return mes === hoyMes && dia === hoyDia;
}



  /**
   * Getter que calcula la edad actual del cliente
   */
  get edad(): number | null {
    if (!this.fechaNacimiento) return null;
    
    const hoy = new Date();
    const cumple = new Date(this.fechaNacimiento);
    
    let edad = hoy.getFullYear() - cumple.getFullYear();
    const mesActual = hoy.getMonth();
    const mesCumple = cumple.getMonth();
    
    if (mesActual < mesCumple || (mesActual === mesCumple && hoy.getDate() < cumple.getDate())) {
      edad--;
    }
    
    return edad;
  }

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
