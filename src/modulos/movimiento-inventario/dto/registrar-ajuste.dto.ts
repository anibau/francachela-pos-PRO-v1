import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrarAjusteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  codigoBarra: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  nuevaCantidad: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  costo: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  precioVenta: number;
}
