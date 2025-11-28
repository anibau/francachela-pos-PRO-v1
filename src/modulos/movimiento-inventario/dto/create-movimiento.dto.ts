import { 
  IsString, 
  IsNumber, 
  IsEnum,
  IsOptional,
  IsNotEmpty 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum TipoMovimiento {
  ENTRADA = 'ENTRADA',
  SALIDA = 'SALIDA',
  AJUSTE = 'AJUSTE'
}

export class CreateMovimientoDto {
  @ApiProperty({ description: 'Código de barras del producto', example: '7501234567890' })
  @IsString()
  @IsNotEmpty()
  codigoBarra: string;

  @ApiProperty({ 
    description: 'Tipo de movimiento',
    enum: TipoMovimiento,
    example: TipoMovimiento.ENTRADA
  })
  @IsEnum(TipoMovimiento)
  tipo: TipoMovimiento;

  @ApiProperty({ description: 'Cantidad del movimiento', example: 10 })
  @IsNumber()
  @Type(() => Number)
  cantidad: number;

  @ApiProperty({ description: 'Costo unitario del producto', example: 15.50 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  costo: number;

  @ApiProperty({ description: 'Precio de venta del producto', example: 25.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  precioVenta: number;

  @ApiProperty({ description: 'Nombre del cajero que realiza el movimiento', example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  cajero: string;

  @ApiPropertyOptional({ description: 'Proveedor del producto', example: 'Distribuidora ABC' })
  @IsOptional()
  @IsString()
  proveedor?: string;
}

