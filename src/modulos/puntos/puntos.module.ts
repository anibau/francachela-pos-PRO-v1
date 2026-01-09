import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PuntosService } from './puntos.service';
import { Cliente } from '../../entities/cliente.entity';
import { ClientePuntosMovimiento } from '../../entities/cliente-puntos-movimiento.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cliente,
      ClientePuntosMovimiento
    ])
  ],
  providers: [PuntosService],
  exports: [PuntosService],
})
export class PuntosModule {}
