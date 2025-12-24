import { IsArray, IsNumber, ValidateNested, Min, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ItemCarritoDto {
  @ApiProperty({
    description: 'ID del producto',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  productoId: number;

  @ApiProperty({
    description: 'Cantidad del producto',
    example: 2,
  })
  @IsNumber()
  @Min(1)
  cantidad: number;

  @ApiProperty({
    description: 'Precio unitario del producto',
    example: 17.50,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  precioUnitario: number;
}

export class EvaluarPromocionesDto {
  @ApiProperty({
    description: 'Items del carrito de compras',
    type: [ItemCarritoDto],
    example: [
      { productoId: 1, cantidad: 2, precioUnitario: 17.50 },
      { productoId: 2, cantidad: 2, precioUnitario: 5.00 },
      { productoId: 3, cantidad: 2, precioUnitario: 5.00 }
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemCarritoDto)
  items: ItemCarritoDto[];

  @ApiProperty({
    description: 'Monto total del carrito antes de descuentos',
    example: 55.00,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  montoTotal: number;
}
