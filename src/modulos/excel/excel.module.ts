import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExcelService } from './excel.service';
import { ExcelController } from './excel.controller';
import { Venta } from '../../entities/venta.entity';
import { Producto } from '../../entities/producto.entity';
import { Cliente } from '../../entities/cliente.entity';
import { MovimientoInventario } from '../../entities/movimiento-inventario.entity';
import { Delivery } from '../../entities/delivery.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Venta, 
    Producto, 
    Cliente, 
    MovimientoInventario, 
    Delivery
  ])],
  controllers: [ExcelController],
  providers: [ExcelService],
  exports: [ExcelService],
})
export class ExcelModule {}

