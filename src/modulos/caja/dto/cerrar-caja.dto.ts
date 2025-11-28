import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CerrarCajaDto {
  @ApiProperty({ description: 'Monto final contado en caja', example: 450.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  montoFinal: number;

  @ApiPropertyOptional({ description: 'Observaciones de cierre', example: 'Cierre normal, sin novedades' })
  @IsOptional()
  @IsString()
  observaciones?: string;
}

