import { 
  IsString, 
  IsEnum, 
  IsNumber, 
  IsOptional, 
  IsBoolean, 
  IsDateString, 
  IsArray, 
  ValidateNested, 
  Min, 
  Max,
  IsNotEmpty,
  ArrayMinSize
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoPromocion } from '../../../common/enums/tipo-promocion.enum';
import { TipoDescuento } from '../../../common/enums/tipo-descuento.enum';
import { PromocionProductoDto } from './promocion-producto.dto';

export class CreatePromocionUnificadaDto {
  @ApiProperty({
    description: 'Nombre de la promoción',
    example: 'Combo Familiar',
  })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({
    description: 'Descripción de la promoción',
    example: '2 hamburguesas + 2 papas + 2 gaseosas',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    description: 'Tipo de promoción',
    enum: TipoPromocion,
    example: TipoPromocion.COMBO,
  })
  @IsEnum(TipoPromocion)
  tipoPromocion: TipoPromocion;

  @ApiProperty({
    description: 'Tipo de descuento',
    enum: TipoDescuento,
    example: TipoDescuento.PRECIO_FIJO,
  })
  @IsEnum(TipoDescuento)
  tipoDescuento: TipoDescuento;

  @ApiProperty({
    description: 'Valor del descuento (porcentaje o monto según tipoDescuento)',
    example: 20,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  descuento: number;

  @ApiPropertyOptional({
    description: 'Precio fijo para COMBO (solo cuando tipoDescuento = PRECIO_FIJO)',
    example: 35.00,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioCombo?: number;

  @ApiProperty({
    description: 'Fecha de inicio de la promoción',
    example: '2024-01-01',
  })
  @IsDateString()
  fechaInicio: string;

  @ApiProperty({
    description: 'Fecha de fin de la promoción',
    example: '2024-12-31',
  })
  @IsDateString()
  fechaFin: string;

  @ApiPropertyOptional({
    description: 'Límite máximo de usos de la promoción',
    example: 1000,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxUsos?: number;

  @ApiPropertyOptional({
    description: 'Estado activo de la promoción',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  activo?: boolean = true;

  @ApiPropertyOptional({
    description: 'Puntos extra otorgados por esta promoción',
    example: 10,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  puntosExtra?: number = 0;

  @ApiProperty({
    description: 'Productos aplicables a la promoción',
    type: [PromocionProductoDto],
    example: [
      { productoId: 1, cantidadExacta: 2 },
      { productoId: 2, cantidadExacta: 2 },
      { productoId: 3, cantidadExacta: 2 }
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PromocionProductoDto)
  productosAplicables: PromocionProductoDto[];
}
