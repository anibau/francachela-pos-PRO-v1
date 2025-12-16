import { IsOptional, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { DatePosUtil } from '../utils/date-pos.util';

export class DateRangeDto {
  @ApiProperty({
    description: 'Fecha de inicio en formato POS: YYYY-MM-DD HH:mm:ss o YYYY-MM-DD',
    example: '2025-12-01 00:00:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(
    /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/,
    { message: 'fechaInicio debe estar en formato YYYY-MM-DD HH:mm:ss o YYYY-MM-DD' }
  )
  @Transform(({ value }) => {
    if (!value) return undefined;
    // Validar usando la utilidad POS
    try {
      DatePosUtil.parseDate(value, false);
      return value;
    } catch (error) {
      throw new Error(`fechaInicio: ${error.message}`);
    }
  })
  fechaInicio?: string;

  @ApiProperty({
    description: 'Fecha de fin en formato POS: YYYY-MM-DD HH:mm:ss o YYYY-MM-DD',
    example: '2025-12-31 23:59:59',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(
    /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/,
    { message: 'fechaFin debe estar en formato YYYY-MM-DD HH:mm:ss o YYYY-MM-DD' }
  )
  @Transform(({ value }) => {
    if (!value) return undefined;
    // Validar usando la utilidad POS
    try {
      DatePosUtil.parseDate(value, true);
      return value;
    } catch (error) {
      throw new Error(`fechaFin: ${error.message}`);
    }
  })
  fechaFin?: string;

  /**
   * Convierte las fechas string a objetos Date usando utilidad POS
   * Maneja automáticamente inicio/fin de día para formatos simplificados
   */
  getDateRange(): { fechaInicio: Date; fechaFin: Date } {
    return DatePosUtil.parseQueryDateRange(this.fechaInicio, this.fechaFin);
  }

  /**
   * Valida que el rango de fechas sea válido
   */
  validateRange(): void {
    const { fechaInicio, fechaFin } = this.getDateRange();
    DatePosUtil.validateDateRange(fechaInicio, fechaFin);
  }
}
