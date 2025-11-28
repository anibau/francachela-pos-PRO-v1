import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CombosService } from './combos.service';
import { CombosController } from './combos.controller';
import { Combo } from '../../entities/combo.entity';
import { Producto } from '../../entities/producto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Combo, Producto])],
  controllers: [CombosController],
  providers: [CombosService],
  exports: [CombosService],
})
export class CombosModule {}

