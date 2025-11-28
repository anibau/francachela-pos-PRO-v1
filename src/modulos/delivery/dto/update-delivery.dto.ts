import { PartialType } from '@nestjs/swagger';
import { CreateDeliveryDto } from './create-delivery.dto';
import { EstadoDelivery } from '../../../common/enums';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDeliveryDto extends PartialType(CreateDeliveryDto) {
  @ApiPropertyOptional({ 
    description: 'Estado del delivery',
    enum: EstadoDelivery,
    example: EstadoDelivery.EN_CAMINO
  })
  @IsOptional()
  @IsEnum(EstadoDelivery)
  estado?: EstadoDelivery;

  @ApiPropertyOptional({ description: 'Hora de salida', example: '14:30' })
  @IsOptional()
  @IsString()
  horaSalida?: string;

  @ApiPropertyOptional({ description: 'Hora de entrega', example: '15:15' })
  @IsOptional()
  @IsString()
  horaEntrega?: string;
}
