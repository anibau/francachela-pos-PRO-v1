import { IsString, IsOptional, IsDateString, IsNotEmpty, Length, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateClienteDto {
  @ApiProperty({ description: 'Nombres del cliente', example: 'Juan Carlos' })
  @IsString()
  @IsNotEmpty()
  nombres: string;

  @ApiProperty({ description: 'Apellidos del cliente', example: 'García López' })
  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @ApiProperty({ description: 'DNI del cliente', example: '12345678' })
  @IsString()
  @IsNotEmpty()
  @Length(8, 10, { message: 'El DNI debe tener entre 8 y 10 dígitos' })
  dni: string;

  @ApiPropertyOptional({ description: 'Fecha de nacimiento', example: '1990-05-15' })
  @IsOptional()
  @IsDateString()
  fechaNacimiento?: string;

  @ApiPropertyOptional({ description: 'Teléfono del cliente', example: '987654321' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({ description: 'Dirección del cliente', example: 'Av. Lima 123, San Isidro' })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({ description: 'Puntos acumulados del cliente', example: 0, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'puntosAcumulados debe ser un número' })
  @Min(0, { message: 'puntosAcumulados no puede ser negativo' })
  puntosAcumulados?: number;
}

