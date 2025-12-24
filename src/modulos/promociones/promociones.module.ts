import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromocionesService } from './promociones.service';
import { PromocionesController } from './promociones.controller';
import { Promocion } from '../../entities/promocion.entity';
// Nuevas entidades unificadas
import { PromocionUnificada } from '../../entities/promocion-unificada.entity';
import { PromocionProducto } from '../../entities/promocion-producto.entity';
// Nuevos servicios
import { PromocionEvaluatorService } from './services/promocion-evaluator.service';
import { PromocionesUnificadasService } from './promociones-unificadas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Promocion, // Mantener temporalmente para compatibilidad
      PromocionUnificada,
      PromocionProducto,
    ])
  ],
  controllers: [PromocionesController],
  providers: [
    PromocionesService,
    PromocionEvaluatorService,
    PromocionesUnificadasService,
  ],
  exports: [
    PromocionesService,
    PromocionEvaluatorService,
    PromocionesUnificadasService,
  ],
})
export class PromocionesModule {}
