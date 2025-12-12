import { 
  IsArray, 
  IsEnum, 
  IsNumber, 
  IsOptional, 
  IsString, 
  ValidateNested, 
  Min, 
  Max,
  ArrayMinSize,
  MaxLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { MetodoPago, TipoCompra } from '../../../common/enums';

/**
 * Validador personalizado para asegurar que el descuento no sea negativo
 */
@ValidatorConstraint({ name: 'isValidDescuento', async: false })
export class IsValidDescuentoConstraint implements ValidatorConstraintInterface {
  validate(value: number | undefined) {
    if (value === undefined || value === null) return true;
    return value >= 0;
  }

  defaultMessage(args: ValidationArguments) {
    return 'El descuento no puede ser negativo';
  }
}

/**
 * Validador para montos recibidos
 */
@ValidatorConstraint({ name: 'isValidMontoRecibido', async: false })
export class IsValidMontoRecibidoConstraint implements ValidatorConstraintInterface {
  validate(value: number | undefined) {
    if (value === undefined || value === null) return true;
    return value >= 0;
  }

  defaultMessage(args: ValidationArguments) {
    return 'El monto recibido no puede ser negativo';
  }
}

export class ItemVentaDto {
  @ApiProperty({ 
    description: 'ID del producto a vender', 
    example: 1,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  productoId: number;

  @ApiProperty({ 
    description: 'Cantidad a comprar', 
    example: 2,
    minimum: 1
  })
  @IsNumber()
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  cantidad: number;

  @ApiPropertyOptional({ 
    description: 'Precio unitario personalizado (si es diferente al precio del producto)', 
    example: 4.50,
    minimum: 0
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 }, 
    { message: 'El precio debe tener máximo 2 decimales' }
  )
  @Min(0.01, { message: 'El precio debe ser mayor a 0' })
  precioUnitario?: number;
}

/**
 * DTO para crear una nueva venta
 * Valida todos los campos según reglas de negocio
 */
export class CreateVentaDto {
  @ApiPropertyOptional({ 
    description: 'ID del cliente (opcional para compras anónimas)', 
    example: 1,
    minimum: 1
  })
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'El ID del cliente debe ser válido' })
  clienteId?: number;

  @ApiProperty({ 
    description: 'Lista de productos a vender (mínimo 1)',
    type: [ItemVentaDto],
    minItems: 1
  })
  @IsArray({ message: 'listaProductos debe ser un array' })
  @ArrayMinSize(1, { message: 'Debe incluir al menos 1 producto' })
  @ValidateNested({ each: true, message: 'Cada producto debe ser válido' })
  @Type(() => ItemVentaDto)
  listaProductos: ItemVentaDto[];

  @ApiPropertyOptional({ 
    description: 'Descuento adicional en soles', 
    example: 5.00,
    default: 0,
    minimum: 0
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0, { message: 'El descuento no puede ser negativo' })
  @Validate(IsValidDescuentoConstraint)
  descuento?: number = 0;

  @ApiProperty({ 
    description: 'Método de pago utilizado',
    enum: MetodoPago,
    example: MetodoPago.EFECTIVO,
    enumName: 'MetodoPago'
  })
  @IsEnum(MetodoPago, { 
    message: `Método de pago debe ser uno de: ${Object.values(MetodoPago).join(', ')}`
  })
  metodoPago: MetodoPago;

  @ApiPropertyOptional({ 
    description: 'Comentario o notas sobre la venta',
    example: 'Cliente preferente - promoción especial',
    maxLength: 500
  })
  @IsOptional()
  @IsString({ message: 'El comentario debe ser texto' })
  @MaxLength(500, { message: 'El comentario no puede superar 500 caracteres' })
  comentario?: string;

  @ApiPropertyOptional({ 
    description: 'Tipo de compra',
    enum: TipoCompra,
    example: TipoCompra.LOCAL,
    default: TipoCompra.LOCAL,
    enumName: 'TipoCompra'
  })
  @IsOptional()
  @IsEnum(TipoCompra, { 
    message: `Tipo de compra debe ser: ${Object.values(TipoCompra).join(' o ')}`
  })
  tipoCompra?: TipoCompra = TipoCompra.LOCAL;

  @ApiPropertyOptional({ 
    description: 'Monto recibido del cliente (usado para calcular vuelto en efectivo)',
    example: 50.00,
    minimum: 0
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Validate(IsValidMontoRecibidoConstraint)
  montoRecibido?: number;

  @ApiPropertyOptional({ 
    description: 'Puntos a canjear del cliente (1 punto = S/ 0.10)',
    example: 10,
    default: 0,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Los puntos no pueden ser negativos' })
  puntosUsados?: number = 0;
}
