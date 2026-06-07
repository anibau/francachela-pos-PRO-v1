import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendDeliveryNotificationDto {
  @ApiProperty({ example: '51987654321' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Av. Principal 123' })
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  repartidor: string;

  @ApiPropertyOptional({ example: '30 minutos' })
  @IsOptional()
  @IsString()
  tiempoEstimado?: string;
}
