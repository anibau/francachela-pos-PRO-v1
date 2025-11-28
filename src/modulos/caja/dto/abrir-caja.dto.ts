import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AbrirCajaDto {
  @ApiProperty({ description: 'Monto inicial en caja', example: 100.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  montoInicial: number;

  @ApiPropertyOptional({ description: 'Observaciones de apertura', example: 'Apertura normal del día' })
  @IsOptional()
  @IsString()
  observaciones?: string;
}

