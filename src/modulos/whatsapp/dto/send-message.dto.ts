import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({ description: 'Número de teléfono (con código de país)', example: '51987654321' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Mensaje a enviar', example: '¡Gracias por tu compra!' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ description: 'ID de la venta relacionada', example: 1 })
  @IsOptional()
  ventaId?: number;
}

