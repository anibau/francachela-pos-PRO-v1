import { IsString, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para actualizar solo el comentario de una venta
 */
export class UpdateVentaComentarioDto {
  @ApiProperty({ 
    description: 'Nuevo comentario para la venta',
    example: 'Cliente solicita cambio de marca para la próxima compra',
    maxLength: 500,
    required: false
  })
  @IsOptional()
  @IsString({ message: 'El comentario debe ser texto' })
  @MaxLength(500, { message: 'El comentario no puede superar 500 caracteres' })
  comentario?: string;
}
