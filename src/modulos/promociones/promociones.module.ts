import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromocionesController } from './promociones.controller';
// Nuevas entidades unificadas
import { PromocionUnificada } from '../../entities/promocion-unificada.entity';
import { PromocionProducto } from '../../entities/promocion-producto.entity';
// Nuevos servicios
import { PromocionEvaluatorService } from './services/promocion-evaluator.service';
import { PromocionesUnificadasService } from './promociones-unificadas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      //Promocion, Mantener temporalmente para compatibilidad
      PromocionUnificada,
      PromocionProducto,
    ])
  ],
  controllers: [PromocionesController],
  providers: [
    PromocionEvaluatorService,
    PromocionesUnificadasService,
  ],
  exports: [
    PromocionEvaluatorService,
    PromocionesUnificadasService,
  ],
})
export class PromocionesModule {}
