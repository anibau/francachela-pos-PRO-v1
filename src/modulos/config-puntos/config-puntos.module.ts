import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigPuntos } from '../../entities/config-puntos.entity';
import { PuntosConfigService } from './puntos-config.service';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigPuntos])],
  providers: [PuntosConfigService],
  exports: [PuntosConfigService],
})
export class ConfigPuntosModule {}
