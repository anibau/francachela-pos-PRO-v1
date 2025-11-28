import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientoInventarioService } from './movimiento-inventario.service';
import { MovimientoInventarioController } from './movimiento-inventario.controller';
import { MovimientoInventario } from '../../entities/movimiento-inventario.entity';
import { Producto } from '../../entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MovimientoInventario, Producto])],
  controllers: [MovimientoInventarioController],
  providers: [MovimientoInventarioService],
  exports: [MovimientoInventarioService],
})
export class MovimientoInventarioModule {}

