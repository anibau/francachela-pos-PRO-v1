import { 
  IsString, 
  IsEnum, 
  IsNumber, 
  IsOptional, 
  IsNotEmpty,
  Min 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CategoriaGasto, MetodoPago } from '../../../common/enums';

export class CreateGastoDto {
  @ApiProperty({ description: 'Descripción del gasto', example: 'Compra de productos de limpieza' })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({ description: 'Monto del gasto', example: 25.50 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  monto: number;

  @ApiProperty({ 
    description: 'Categoría del gasto',
    enum: CategoriaGasto,
    example: CategoriaGasto.OPERATIVO
  })
  @IsEnum(CategoriaGasto)
  categoria: CategoriaGasto;

  @ApiProperty({ 
    description: 'Método de pago utilizado',
    enum: MetodoPago,
    example: MetodoPago.EFECTIVO
  })
  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;

  @ApiPropertyOptional({ description: 'Proveedor del gasto', example: 'Distribuidora ABC' })
  @IsOptional()
  @IsString()
  proveedor?: string;

  @ApiPropertyOptional({ description: 'Número de comprobante', example: 'F001-00001234' })
  @IsOptional()
  @IsString()
  numeroComprobante?: string;

  @ApiPropertyOptional({ description: 'Archivo de comprobante (URL)', example: 'https://example.com/comprobante.pdf' })
  @IsOptional()
  @IsString()
  comprobante?: string;
}
