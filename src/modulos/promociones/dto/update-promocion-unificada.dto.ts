import { PartialType } from '@nestjs/swagger';
import { CreatePromocionUnificadaDto } from './create-promocion-unificada.dto';

export class UpdatePromocionUnificadaDto extends PartialType(CreatePromocionUnificadaDto) {}
