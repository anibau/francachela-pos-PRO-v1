import { 
  IsString, 
  IsNumber, 
  IsOptional, 
  IsEnum,
  IsNotEmpty 
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EstadoDelivery } from '../../../common/enums';

export class CreateDeliveryDto {
  @ApiPropertyOptional({ description: 'ID del cliente', example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  clienteId?: number;

  @ApiProperty({ description: 'ID del pedido/venta', example: 1 })
  @IsNumber()
  @Type(() => Number)
  pedidoId: number;

  @ApiProperty({ description: 'Dirección de entrega', example: 'Av. Principal 123, San Isidro' })
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @ApiProperty({ description: 'Nombre del repartidor', example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  repartidor: string;

  @ApiPropertyOptional({ description: 'Teléfono de contacto', example: '987654321' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'Costo del delivery', example: 5.00 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  deliveryFee?: number;

  @ApiPropertyOptional({ description: 'Notas adicionales', example: 'Casa de color azul, segundo piso' })
  @IsOptional()
  @IsString()
  notes?: string;
}
