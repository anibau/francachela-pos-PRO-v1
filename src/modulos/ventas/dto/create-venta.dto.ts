import { 
  IsArray, 
  IsEnum, 
  IsNumber, 
  IsOptional, 
  IsString, 
  ValidateNested, 
  Min, 
  ArrayMinSize 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MetodoPago, TipoCompra } from '../../../common/enums';

export class ItemVentaDto {
  @ApiProperty({ description: 'ID del producto', example: 1 })
  @IsNumber()
  productoId: number;

  @ApiProperty({ description: 'Cantidad del producto', example: 2 })
  @IsNumber()
  @Min(1)
  cantidad: number;

  @ApiPropertyOptional({ description: 'Precio unitario (si es diferente al precio del producto)', example: 4.50 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioUnitario?: number;
}

export class CreateVentaDto {
  @ApiPropertyOptional({ description: 'ID del cliente (opcional)', example: 1 })
  @IsOptional()
  @IsNumber()
  clienteId?: number;

  @ApiProperty({ 
    description: 'Lista de productos de la venta',
    type: [ItemVentaDto]
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemVentaDto)
  listaProductos: ItemVentaDto[];

  @ApiPropertyOptional({ description: 'Descuento aplicado', example: 5.00, default: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  descuento?: number = 0;

  @ApiProperty({ 
    description: 'Método de pago',
    enum: MetodoPago,
    example: MetodoPago.EFECTIVO
  })
  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;

  @ApiPropertyOptional({ description: 'Comentario de la venta', example: 'Cliente frecuente' })
  @IsOptional()
  @IsString()
  comentario?: string;

  @ApiPropertyOptional({ 
    description: 'Tipo de compra',
    enum: TipoCompra,
    example: TipoCompra.LOCAL,
    default: TipoCompra.LOCAL
  })
  @IsOptional()
  @IsEnum(TipoCompra)
  tipoCompra?: TipoCompra = TipoCompra.LOCAL;

  @ApiPropertyOptional({ description: 'Monto recibido (para efectivo)', example: 50.00 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montoRecibido?: number;

  @ApiPropertyOptional({ description: 'Puntos a usar del cliente', example: 10, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  puntosUsados?: number = 0;
}
