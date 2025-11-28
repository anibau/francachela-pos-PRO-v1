import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productoDescripcion: string;

  @Column({ unique: true })
  codigoBarra: string;

  @Column({ nullable: true })
  imagen: string;

  @Column('decimal', { precision: 10, scale: 2 })
  costo: number;

  @Column('decimal', { precision: 10, scale: 2 })
  precio: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  precioMayoreo: number;

  @Column('int')
  cantidadActual: number;

  @Column('int')
  cantidadMinima: number;

  @Column({ nullable: true })
  proveedor: string;

  @Column({ nullable: true })
  categoria: string;

  @Column('int', { default: 0 })
  valorPuntos: number;

  @Column({ default: true })
  mostrar: boolean;

  @Column({ default: true })
  usaInventario: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}

