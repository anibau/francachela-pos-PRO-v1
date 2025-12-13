import { ValueTransformer } from 'typeorm';

/**
 * Transformador para campos decimales que asegura la conversión correcta
 * entre la base de datos (string) y la aplicación (number)
 */
export class DecimalTransformer implements ValueTransformer {
  /**
   * Convierte el valor de la aplicación (number) al formato de base de datos (string)
   */
  to(value: number): string | null {
    if (value === null || value === undefined) {
      return null;
    }
    return value.toString();
  }

  /**
   * Convierte el valor de la base de datos (string) al formato de aplicación (number)
   */
  from(value: string): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    
    // Asegurar que el valor sea un número válido
    const numericValue = parseFloat(value);
    
    if (isNaN(numericValue)) {
      console.warn(`DecimalTransformer: Valor inválido recibido: ${value}`);
      return 0;
    }
    
    return numericValue;
  }
}

/**
 * Instancia singleton del transformador decimal
 */
export const decimalTransformer = new DecimalTransformer();
