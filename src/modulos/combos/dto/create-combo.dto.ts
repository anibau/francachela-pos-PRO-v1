import { 
  IsString, 
  IsNumber, 
  IsArray, 
  IsOptional, 
  IsBoolean,
  ValidateNested,
  ArrayMinSize,
  Min 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ProductoComboDto {
  @ApiProperty({ description: 'ID del producto', example: 1 })
  @IsNumber()
  @Type(() => Number)
  productoId: number;

  @ApiProperty({ description: 'Cantidad del producto en el combo', example: 2 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  cantidad: number;
}

export class CreateComboDto {
  @ApiProperty({ description: 'Nombre del combo', example: 'Combo Familiar' })
  @IsString()
  nombre: string;

  @ApiPropertyOptional({ description: 'Descripción del combo', example: '2 hamburguesas + 2 papas + 2 gaseosas' })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ 
    description: 'Productos incluidos en el combo',
    type: [ProductoComboDto],
    example: [
      { productoId: 1, cantidad: 2 },
      { productoId: 2, cantidad: 2 }
    ]
  })
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => ProductoComboDto)
  productos: ProductoComboDto[];

  @ApiProperty({ description: 'Precio original sin descuento', example: 45.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  precioOriginal: number;

  @ApiProperty({ description: 'Precio del combo con descuento', example: 35.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  precioCombo: number;

  @ApiPropertyOptional({ description: 'Puntos extra por comprar el combo', example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  puntosExtra?: number;

  @ApiPropertyOptional({ description: 'Si el combo está activo', example: true })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

