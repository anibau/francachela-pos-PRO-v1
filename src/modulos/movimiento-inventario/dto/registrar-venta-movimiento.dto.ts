import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistrarVentaMovimientoDto {
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
  precioVenta: number;
}
