import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorteService } from './corte.service';
import { CorteController } from './corte.controller';
import { CorteExcelService } from './corte-excel.service';
import { Venta } from '../../entities/venta.entity';
import { Gasto } from '../../entities/gasto.entity';
import { VentaPago } from '../../entities/venta-pago.entity';
import { EntradasModule } from '../entradas/entradas.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, Gasto, VentaPago]),
    EntradasModule,
  ],
  controllers: [CorteController],
  providers: [CorteService, CorteExcelService],
  exports: [CorteService],
})
export class CorteModule {}
