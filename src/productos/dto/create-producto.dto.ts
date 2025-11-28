import { IsString, IsNumber, IsOptional, IsBoolean, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductoDto {
  @ApiProperty({ description: 'Descripción del producto', example: 'Cerveza Pilsen 650ml' })
  @IsString()
  @IsNotEmpty()
  productoDescripcion: string;

  @ApiProperty({ description: 'Código de barras único', example: '7751271001234' })
  @IsString()
  @IsNotEmpty()
  codigoBarra: string;

  @ApiPropertyOptional({ description: 'URL de la imagen del producto' })
  @IsOptional()
  @IsString()
  imagen?: string;

  @ApiProperty({ description: 'Costo del producto', example: 2.50 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  costo: number;

  @ApiProperty({ description: 'Precio de venta', example: 4.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  precio: number;

  @ApiPropertyOptional({ description: 'Precio de mayoreo', example: 3.50 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Type(() => Number)
  precioMayoreo?: number;

  @ApiProperty({ description: 'Cantidad actual en stock', example: 100 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  cantidadActual: number;

  @ApiProperty({ description: 'Cantidad mínima en stock', example: 10 })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  cantidadMinima: number;

  @ApiPropertyOptional({ description: 'Proveedor del producto', example: 'Backus' })
  @IsOptional()
  @IsString()
  proveedor?: string;

  @ApiPropertyOptional({ description: 'Categoría del producto', example: 'Bebidas' })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiPropertyOptional({ description: 'Valor en puntos del producto', example: 5, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  valorPuntos?: number = 0;

  @ApiPropertyOptional({ description: 'Si el producto se muestra en el sistema', default: true })
  @IsOptional()
  @IsBoolean()
  mostrar?: boolean = true;

  @ApiPropertyOptional({ description: 'Si el producto usa control de inventario', default: true })
  @IsOptional()
  @IsBoolean()
  usaInventario?: boolean = true;
}

