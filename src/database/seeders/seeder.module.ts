import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSeeder } from './database.seeder';
import { Usuario } from '../../entities/usuario.entity';
import { Producto } from '../../entities/producto.entity';
import { Cliente } from '../../entities/cliente.entity';
import { Promocion } from '../../entities/promocion.entity';
import { Combo } from '../../entities/combo.entity';
import { Venta } from '../../entities/venta.entity';
import { Caja } from '../../entities/caja.entity';
import { Gasto } from '../../entities/gasto.entity';
import { Delivery } from '../../entities/delivery.entity';
import { MovimientoInventario } from '../../entities/movimiento-inventario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Usuario,
      Producto,
      Cliente,
      Promocion,
      Combo,
      Venta,
      Caja,
      Gasto,
      Delivery,
      MovimientoInventario,
    ]),
  ],
  providers: [DatabaseSeeder],
  exports: [DatabaseSeeder],
})
export class SeederModule {}

