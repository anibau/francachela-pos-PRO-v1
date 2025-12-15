import { IsEnum, IsNumber, IsOptional, IsString, Min, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MetodoPago } from '../../../common/enums';

/**
 * DTO para crear un pago individual dentro de una venta
 * Usado en la nueva arquitectura normalizada de pagos
 */
export class CreateVentaPagoDto {
  @ApiProperty({ 
    description: 'Método de pago utilizado',
    enum: MetodoPago,
    example: MetodoPago.EFECTIVO,
    enumName: 'MetodoPago'
  })
  @IsEnum(MetodoPago, { 
    message: `Método de pago debe ser uno de: ${Object.values(MetodoPago).join(', ')}`
  })
  metodoPago: MetodoPago;

  @ApiProperty({ 
    description: 'Monto pagado con este método específico', 
    example: 50.00,
    minimum: 0.01
  })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El monto debe tener máximo 2 decimales' })
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  monto: number;

  @ApiPropertyOptional({ 
    description: 'Referencia del pago (número de operación, voucher, etc.)',
    example: 'TXN-123456',
    maxLength: 100
  })
  @IsOptional()
  @IsString({ message: 'La referencia debe ser texto' })
  @MaxLength(100, { message: 'La referencia no puede superar 100 caracteres' })
  referencia?: string;

  @ApiPropertyOptional({ 
    description: 'Notas adicionales del pago',
    example: 'Pago con billete de 100',
    maxLength: 200
  })
  @IsOptional()
  @IsString({ message: 'Las notas deben ser texto' })
  @MaxLength(200, { message: 'Las notas no pueden superar 200 caracteres' })
  notas?: string;
}

/**
 * DTO de respuesta para un pago de venta
 * Incluye información completa del pago registrado
 */
export class VentaPagoResponseDto {
  @ApiProperty({ description: 'ID único del pago', example: 1 })
  id: number;

  @ApiProperty({ description: 'ID de la venta asociada', example: 123 })
  ventaId: number;

  @ApiProperty({ 
    description: 'Método de pago utilizado',
    enum: MetodoPago,
    example: MetodoPago.EFECTIVO
  })
  metodoPago: MetodoPago;

  @ApiProperty({ description: 'Monto del pago', example: 50.00 })
  monto: number;

  @ApiPropertyOptional({ description: 'Referencia del pago', example: 'TXN-123456' })
  referencia?: string;

  @ApiProperty({ 
    description: 'Estado del pago',
    enum: ['PENDIENTE', 'COMPLETADO', 'RECHAZADO'],
    example: 'COMPLETADO'
  })
  estado: 'PENDIENTE' | 'COMPLETADO' | 'RECHAZADO';

  @ApiPropertyOptional({ description: 'Notas del pago', example: 'Pago confirmado' })
  notas?: string;

  @ApiProperty({ description: 'Fecha de registro del pago', example: '2024-12-15T10:30:00Z' })
  fechaRegistro: Date;

  @ApiProperty({ description: 'Usuario que registró el pago', example: 'cajero_01' })
  registradoPor: string;

  @ApiProperty({ description: 'Secuencia del pago en la venta', example: 1 })
  secuencia: number;
}
