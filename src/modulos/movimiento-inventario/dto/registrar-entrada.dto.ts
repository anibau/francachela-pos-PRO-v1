import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegistrarEntradaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  codigoBarra: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  cantidad: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  costo: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  precioVenta: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  proveedor?: string;
}
