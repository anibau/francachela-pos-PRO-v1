import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigPuntos } from '../../entities/config-puntos.entity';
import { UpdateConfigPuntosDto } from './dto/update-config-puntos.dto';

export interface PuntosConfigValues {
  valorPunto: number;
  limiteCanjePorcentaje: number;
  factorOtorgamiento: number;
}

const DEFAULTS: PuntosConfigValues = {
  valorPunto: 0.1,
  limiteCanjePorcentaje: 0.5,
  factorOtorgamiento: 1,
};

@Injectable()
export class PuntosConfigService {
  private cache: { values: PuntosConfigValues; expiresAt: number } | null = null;
  private readonly TTL_MS = 60_000;

  constructor(
    @InjectRepository(ConfigPuntos)
    private readonly repo: Repository<ConfigPuntos>,
  ) {}

  async getConfig(): Promise<PuntosConfigValues> {
    if (this.cache && Date.now() < this.cache.expiresAt) {
      return this.cache.values;
    }
    let row = await this.repo.findOne({ where: {}, order: { id: 'ASC' } });
    if (!row) {
      row = this.repo.create({ ...DEFAULTS });
      row = await this.repo.save(row);
    }
    const values: PuntosConfigValues = {
      valorPunto: Number(row.valorPunto),
      limiteCanjePorcentaje: Number(row.limiteCanjePorcentaje),
      factorOtorgamiento: Number(row.factorOtorgamiento),
    };
    this.cache = { values, expiresAt: Date.now() + this.TTL_MS };
    return values;
  }

  async updateConfig(dto: UpdateConfigPuntosDto, updatedBy: string): Promise<PuntosConfigValues> {
    let row = await this.repo.findOne({ where: {}, order: { id: 'ASC' } });
    if (!row) {
      row = this.repo.create({ ...DEFAULTS });
    }
    if (dto.valorPunto !== undefined) row.valorPunto = dto.valorPunto;
    if (dto.limiteCanjePorcentaje !== undefined) row.limiteCanjePorcentaje = dto.limiteCanjePorcentaje;
    if (dto.factorOtorgamiento !== undefined) row.factorOtorgamiento = dto.factorOtorgamiento;
    row.updatedBy = updatedBy;
    await this.repo.save(row);
    this.cache = null;
    return this.getConfig();
  }

  /** Para tests sin BD */
  getDefaults(): PuntosConfigValues {
    return { ...DEFAULTS };
  }

  invalidateCache(): void {
    this.cache = null;
  }
}
