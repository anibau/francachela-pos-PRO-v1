import { DataSource } from 'typeorm';

/**
 * Utilidad para sincronizar las secuencias de PostgreSQL
 * Cuando se cargan datos manualmente, las secuencias no se actualizan automáticamente
 * Esta utilidad resincroniza todas las secuencias basándose en los valores máximos de cada tabla
 */
export class SequenceSyncUtil {
  /**
   * Sincroniza todas las secuencias de las tablas principales
   * Debe ejecutarse después de cargar datos manualmente en la BD
   */
  static async syncAllSequences(dataSource: DataSource): Promise<void> {
    const tablesToSync = [
      'productos',
      'clientes',
      'usuarios',
      'ventas',
      'gastos',
      'combos',
      'cajas',
      'delivery',
      'promociones',
      'movimientos_inventario',
      'venta_pagos',
    ];

    for (const table of tablesToSync) {
      await this.syncSequenceForTable(dataSource, table);
    }
  }

  /**
   * Sincroniza la secuencia de una tabla específica
   * @param dataSource - Instancia de DataSource de TypeORM
   * @param tableName - Nombre de la tabla
   */
  static async syncSequenceForTable(dataSource: DataSource, tableName: string): Promise<void> {
    try {
      // Obtener el nombre de la secuencia (por convención de TypeORM)
      const sequenceName = `${tableName}_id_seq`;

      // Obtener el máximo ID actual de la tabla
      const result = await dataSource.query(
        `SELECT MAX(id) as max_id FROM ${tableName}`
      );

      const maxId = result[0]?.max_id || 0;
      const nextValue = maxId + 1;

      // Actualizar la secuencia al siguiente valor
      await dataSource.query(
        `ALTER SEQUENCE ${sequenceName} RESTART WITH ${nextValue}`
      );

      console.log(`✓ Secuencia ${sequenceName} sincronizada a: ${nextValue}`);
    } catch (error) {
      console.warn(
        `⚠ No se pudo sincronizar secuencia para tabla ${tableName}: ${error.message}`
      );
      // No lanzar error para permitir que continúe con otras tablas
    }
  }

  /**
   * Verifica el estado actual de todas las secuencias
   * Útil para debugging
   */
  static async getSequenceStatus(dataSource: DataSource): Promise<Array<{
    table: string;
    maxId: number;
    sequenceValue: number;
    status: 'OK' | 'OUT_OF_SYNC';
  }>> {
    const tablesToCheck = [
      'productos',
      'clientes',
      'usuarios',
      'ventas',
      'gastos',
      'combos',
      'cajas',
      'delivery',
      'promociones',
      'movimientos_inventario',
      'venta_pagos',
    ];

    const status: Array<{
      table: string;
      maxId: number;
      sequenceValue: number;
      status: 'OK' | 'OUT_OF_SYNC';
    }> = [];

    for (const table of tablesToCheck) {
      try {
        const sequenceName = `${table}_id_seq`;

        // Obtener máximo ID
        const maxResult = await dataSource.query(
          `SELECT MAX(id) as max_id FROM ${table}`
        );
        const maxId = maxResult[0]?.max_id || 0;

        // Obtener valor actual de la secuencia
        const seqResult = await dataSource.query(
          `SELECT last_value FROM ${sequenceName}`
        );
        const sequenceValue = seqResult[0]?.last_value || 0;

        const isInSync = sequenceValue > maxId;

        status.push({
          table,
          maxId,
          sequenceValue,
          status: isInSync ? 'OK' : 'OUT_OF_SYNC',
        });
      } catch (error) {
        // Tabla no existe o secuencia no existe
        status.push({
          table,
          maxId: 0,
          sequenceValue: 0,
          status: 'OUT_OF_SYNC',
        });
      }
    }

    return status;
  }

  /**
   * Resincroniza una secuencia de forma segura dentro de una transacción
   */
  static async syncSequenceTransactional(
    dataSource: DataSource,
    tableName: string
  ): Promise<{ success: boolean; message: string }> {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sequenceName = `${tableName}_id_seq`;

      // Obtener máximo ID
      const result = await queryRunner.query(
        `SELECT MAX(id) as max_id FROM ${tableName}`
      );
      const maxId = result[0]?.max_id || 0;
      const nextValue = maxId + 1;

      // Actualizar secuencia
      await queryRunner.query(
        `ALTER SEQUENCE ${sequenceName} RESTART WITH ${nextValue}`
      );

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: `Secuencia ${sequenceName} sincronizada exitosamente a: ${nextValue}`,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return {
        success: false,
        message: `Error al sincronizar secuencia: ${error.message}`,
      };
    } finally {
      await queryRunner.release();
    }
  }
}
