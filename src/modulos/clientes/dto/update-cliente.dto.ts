import { PartialType } from '@nestjs/swagger';
import { CreateClienteDto } from './create-cliente.dto';
import { IsOptional, IsNumber, Min, IsDateString, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para actualizar un cliente
 * Hereda todos los campos opcionales de CreateClienteDto
 * Además permite actualizar el campo puntosAcumulados
 */
export class UpdateClienteDto extends PartialType(CreateClienteDto) {
  @ApiPropertyOptional({
    description: 'Puntos acumulados del cliente (solo administrador)',
    example: 48,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Los puntos acumulados no pueden ser negativos' })
  puntosAcumulados?: number;
}

