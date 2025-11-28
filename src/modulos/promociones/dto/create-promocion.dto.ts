import { 
  IsString, 
  IsEnum, 
  IsNumber, 
  IsOptional, 
  IsDateString, 
  IsArray, 
  IsBoolean,
  Min,
  IsNotEmpty 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TipoPromocion } from '../../../entities/promocion.entity';

export class CreatePromocionDto {
  @ApiProperty({ description: 'Nombre de la promoción', example: 'Descuento de Verano' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({ description: 'Descripción de la promoción', example: '20% de descuento en bebidas' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ 
    description: 'Tipo de promoción',
    enum: TipoPromocion,
    example: TipoPromocion.PORCENTAJE
  })
  @IsEnum(TipoPromocion)
  tipo: TipoPromocion;

  @ApiProperty({ description: 'Valor del descuento (porcentaje o monto fijo)', example: 20 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  descuento: number;

  @ApiProperty({ description: 'Fecha de inicio de la promoción', example: '2024-01-01' })
  @IsDateString()
  fechaInicio: Date;

  @ApiProperty({ description: 'Fecha de fin de la promoción', example: '2024-01-31' })
  @IsDateString()
  fechaFin: Date;

  @ApiPropertyOptional({ description: 'Productos aplicables (IDs)', example: [1, 2, 3] })
  @IsOptional()
  @IsArray()
  productosAplicables?: number[];

  @ApiPropertyOptional({ description: 'Monto mínimo de compra', example: 50.00 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  montoMinimo?: number;

  @ApiPropertyOptional({ description: 'Cantidad máxima de usos', example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  cantidadMaximaUsos?: number;

  @ApiPropertyOptional({ description: 'Si la promoción está activa', default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;
}

