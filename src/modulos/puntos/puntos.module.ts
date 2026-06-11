import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuntosService } from './puntos.service';
import { PuntosController } from './puntos.controller';
import { Cliente } from '../../entities/cliente.entity';
import { ClientePuntosMovimiento } from '../../entities/cliente-puntos-movimiento.entity';
import { Producto } from '../../entities/producto.entity';
import { ConfigPuntosModule } from '../config-puntos/config-puntos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cliente,
      ClientePuntosMovimiento,
      Producto
    ]),
    ConfigPuntosModule,
  ],
  controllers: [PuntosController],
  providers: [PuntosService],
  exports: [PuntosService],
})
export class PuntosModule {}
