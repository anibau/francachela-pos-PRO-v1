import { IsDateString, IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export enum TipoReporte {
  VENTAS = 'VENTAS',
  PRODUCTOS = 'PRODUCTOS',
  CLIENTES = 'CLIENTES',
  INVENTARIO = 'INVENTARIO',
  DELIVERY = 'DELIVERY'
}

export class ExportVentasDto {
  @ApiPropertyOptional({ description: 'Fecha de inicio (YYYY-MM-DD)', example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @ApiPropertyOptional({ description: 'Fecha de fin (YYYY-MM-DD)', example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @ApiPropertyOptional({ 
    description: 'Tipo de reporte a exportar',
    enum: TipoReporte,
    example: TipoReporte.VENTAS
  })
  @IsOptional()
  @IsEnum(TipoReporte)
  tipoReporte?: TipoReporte;

  @ApiPropertyOptional({ description: 'Incluir detalles de productos', example: true })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  incluirDetalles?: boolean;
}

