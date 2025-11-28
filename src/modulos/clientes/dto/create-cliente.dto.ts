import { IsString, IsOptional, IsDateString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  @Length(8, 8, { message: 'El DNI debe tener exactamente 8 dígitos' })
  dni: string;

  @ApiPropertyOptional({ description: 'Fecha de nacimiento', example: '1990-05-15' })
  @IsOptional()
  @IsDateString()
  fechaNacimiento?: Date;

  @ApiPropertyOptional({ description: 'Teléfono del cliente', example: '987654321' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({ description: 'Dirección del cliente', example: 'Av. Lima 123, San Isidro' })
  @IsOptional()
  @IsString()
  direccion?: string;
}

