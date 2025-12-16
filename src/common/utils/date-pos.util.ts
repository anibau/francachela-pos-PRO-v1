/**
 * Utilidad para manejo de fechas en el sistema POS
 * Proporciona parseo y validación de fechas en formatos específicos del POS
 */
export class DatePosUtil {
  /**
   * Formatos soportados:
   * - YYYY-MM-DD (asume inicio o fin de día según isFechaFin)
   * - YYYY-MM-DD HH:mm:ss (formato completo)
   */
  private static readonly DATE_REGEX = /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/;

  /**
   * Parsea una cadena de fecha en formato POS
   * @param dateString - Cadena de fecha en formato YYYY-MM-DD o YYYY-MM-DD HH:mm:ss
   * @param isFechaFin - Si es true, para formato YYYY-MM-DD usa 23:59:59; si es false usa 00:00:00
   * @returns Objeto Date parseado
   * @throws Error si la cadena no está en formato válido
   */
  static parseDate(dateString: string, isFechaFin: boolean = false): Date {
    if (!dateString) {
      throw new Error('La fecha no puede estar vacía');
    }

    if (!this.DATE_REGEX.test(dateString)) {
      throw new Error(
        `Formato de fecha inválido: ${dateString}. Use YYYY-MM-DD o YYYY-MM-DD HH:mm:ss`
      );
    }

    let dateStr = dateString.trim();

    // Si solo tiene la fecha (sin hora), agregar hora según si es inicio o fin del día
    if (!dateStr.includes(':')) {
      if (isFechaFin) {
        dateStr = `${dateStr} 23:59:59`;
      } else {
        dateStr = `${dateStr} 00:00:00`;
      }
    }

    const date = new Date(dateStr);

    // Validar que la fecha parseada sea válida
    if (isNaN(date.getTime())) {
      throw new Error(`No se pudo parsear la fecha: ${dateString}`);
    }

    return date;
  }

  /**
   * Parsea un rango de fechas desde el DTO
   * @param fechaInicio - Fecha de inicio (opcional)
   * @param fechaFin - Fecha de fin (opcional)
   * @returns Objeto con fechaInicio y fechaFin parseadas
   */
  static parseQueryDateRange(
    fechaInicio?: string,
    fechaFin?: string
  ): { fechaInicio: Date; fechaFin: Date } {
    let inicio: Date;
    let fin: Date;

    if (fechaInicio) {
      inicio = this.parseDate(fechaInicio, false);
    } else {
      // Si no se especifica fecha inicio, usar hace 30 días a las 00:00:00
      inicio = new Date();
      inicio.setDate(inicio.getDate() - 30);
      inicio.setHours(0, 0, 0, 0);
    }

    if (fechaFin) {
      fin = this.parseDate(fechaFin, true);
    } else {
      // Si no se especifica fecha fin, usar hoy a las 23:59:59
      fin = new Date();
      fin.setHours(23, 59, 59, 999);
    }

    return { fechaInicio: inicio, fechaFin: fin };
  }

  /**
   * Valida que el rango de fechas sea válido
   * @param fechaInicio - Fecha de inicio
   * @param fechaFin - Fecha de fin
   * @throws Error si fechaInicio es posterior a fechaFin
   */
  static validateDateRange(fechaInicio: Date, fechaFin: Date): void {
    if (!fechaInicio || !fechaFin) {
      throw new Error('Las fechas de inicio y fin son requeridas');
    }

    if (!(fechaInicio instanceof Date) || isNaN(fechaInicio.getTime())) {
      throw new Error('fechaInicio no es una fecha válida');
    }

    if (!(fechaFin instanceof Date) || isNaN(fechaFin.getTime())) {
      throw new Error('fechaFin no es una fecha válida');
    }

    if (fechaInicio > fechaFin) {
      throw new Error(
        `fechaInicio (${fechaInicio.toISOString()}) no puede ser posterior a fechaFin (${fechaFin.toISOString()})`
      );
    }
  }

  /**
   * Formatea una fecha como string en formato POS
   * @param date - Objeto Date a formatear
   * @param includeTime - Si incluir la hora en el formato
   * @returns String de fecha formateada
   */
  static formatDate(date: Date, includeTime: boolean = true): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      throw new Error('La fecha proporcionada no es válida');
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    if (includeTime) {
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    return `${year}-${month}-${day}`;
  }

  /**
   * Obtiene el inicio del día (00:00:00)
   */
  static getStartOfDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }

  /**
   * Obtiene el fin del día (23:59:59)
   */
  static getEndOfDay(date: Date): Date {
    const newDate = new Date(date);
    newDate.setHours(23, 59, 59, 999);
    return newDate;
  }

  /**
   * Compara si dos fechas son el mismo día
   */
  static isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}
