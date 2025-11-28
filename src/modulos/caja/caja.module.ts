import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CajaService } from './caja.service';
import { CajaController } from './caja.controller';
import { Caja } from '../../entities/caja.entity';
import { Venta } from '../../entities/venta.entity';
import { Gasto } from '../../entities/gasto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Caja, Venta, Gasto])],
  controllers: [CajaController],
  providers: [CajaService],
  exports: [CajaService],
})
export class CajaModule {}

