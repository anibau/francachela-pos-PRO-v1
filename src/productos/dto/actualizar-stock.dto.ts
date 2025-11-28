import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { TipoMovimiento } from '../../entities/movimiento-inventario.entity';

export class ActualizarStockDto {
  @ApiProperty({ 
    description: 'Cantidad a modificar o nueva cantidad total (según el tipo)',
    example: 50 
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  cantidad: number;

  @ApiProperty({ 
    description: 'Tipo de movimiento de inventario',
    enum: TipoMovimiento,
    example: TipoMovimiento.ENTRADA
  })
  @IsEnum(TipoMovimiento)
  tipo: TipoMovimiento;

  @ApiPropertyOptional({ 
    description: 'Observaciones del movimiento',
    example: 'Compra de mercancía'
  })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @ApiPropertyOptional({ 
    description: 'Proveedor (para movimientos de entrada)',
    example: 'Distribuidora ABC'
  })
  @IsOptional()
  @IsString()
  proveedor?: string;

  @ApiPropertyOptional({ 
    description: 'Número de factura o comprobante',
    example: 'F001-00001234'
  })
  @IsOptional()
  @IsString()
  numeroFactura?: string;
}

