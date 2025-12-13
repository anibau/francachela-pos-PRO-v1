import { IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class DateRangeDto {
  @ApiProperty({
    description: 'Fecha de inicio en formato YYYY-MM-DD',
    example: '2025-12-01',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'fechaInicio debe ser una fecha válida en formato YYYY-MM-DD' })
  @Transform(({ value }) => {
    if (!value) return undefined;
    // Asegurar que la fecha esté en formato correcto
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error('Fecha inválida');
    }
    return value;
  })
  fechaInicio?: string;

  @ApiProperty({
    description: 'Fecha de fin en formato YYYY-MM-DD',
    example: '2025-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString({}, { message: 'fechaFin debe ser una fecha válida en formato YYYY-MM-DD' })
  @Transform(({ value }) => {
    if (!value) return undefined;
    // Asegurar que la fecha esté en formato correcto
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error('Fecha inválida');
    }
    return value;
  })
  fechaFin?: string;

  /**
   * Convierte las fechas string a objetos Date
   */
  getDateRange(): { fechaInicio: Date; fechaFin: Date } {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    return {
      fechaInicio: this.fechaInicio ? new Date(this.fechaInicio) : startOfMonth,
      fechaFin: this.fechaFin ? new Date(this.fechaFin + 'T23:59:59.999Z') : endOfMonth,
    };
  }
}
