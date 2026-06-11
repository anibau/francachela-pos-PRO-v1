import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class UpdateConfigPuntosDto {
  @ApiPropertyOptional({ example: 0.1, description: 'Valor en soles por punto canjeado' })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  valorPunto?: number;

  @ApiPropertyOptional({ example: 0.5, description: 'Límite canje por producto (0-1)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  limiteCanjePorcentaje?: number;

  @ApiPropertyOptional({ example: 1, description: 'Factor puntos otorgados por sol cobrado' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  factorOtorgamiento?: number;
}
