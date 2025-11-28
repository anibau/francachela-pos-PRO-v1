import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './productos.service';
import { ProductosController } from './productos.controller';
import { Producto } from '../entities/producto.entity';
import { MovimientoInventario } from '../entities/movimiento-inventario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Producto, MovimientoInventario])],
  controllers: [ProductosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule {}

