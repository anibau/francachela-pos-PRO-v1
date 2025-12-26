/**
 * Tipos de descuento disponibles en el sistema
 * 
 * PORCENTAJE: Descuento expresado como porcentaje (ej: 15%)
 * MONTO_FIJO: Descuento de monto fijo (ej: S/ 5.00)
 * PRECIO_FIJO: Precio fijo para el combo/pack (ej: S/ 35.00)
 */
export enum TipoDescuento {
  PORCENTAJE = 'PORCENTAJE',
  MONTO_FIJO = 'MONTO_FIJO',
  PRECIO_FIJO = 'PRECIO_FIJO'
}
