import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendVentaNotificationDto {
  @ApiProperty({ example: '51987654321' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 45.5 })
  @IsNumber()
  @Min(0)
  total: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0)
  puntosGanados: number;

  @ApiProperty({ example: '20250607-0001' })
  @IsString()
  @IsNotEmpty()
  ventaId: string;
}
