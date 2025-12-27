import { IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PromocionProductoDto {
  @ApiProperty({
    description: 'ID del producto',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  productoId: number;

  @ApiPropertyOptional({
    description: 'Cantidad exacta requerida para PACK y COMBO',
    example: 2,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  cantidadExacta?: number;

  @ApiPropertyOptional({
    description: 'Cantidad mínima requerida para SIMPLE',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  cantidadMinima?: number;

  @ApiPropertyOptional({
    description: 'Si es obligatorio para que aplique la promoción (usado en COMBO)',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  obligatorio?: boolean = true;
}
