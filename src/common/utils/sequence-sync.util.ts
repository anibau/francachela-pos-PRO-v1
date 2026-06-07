import { BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';

export const ALLOWED_SYNC_TABLES = [
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
] as const;

export type AllowedSyncTable = (typeof ALLOWED_SYNC_TABLES)[number];

/**
 * Utilidad para sincronizar las secuencias de PostgreSQL
 * Cuando se cargan datos manualmente, las secuencias no se actualizan automáticamente
 * Esta utilidad resincroniza todas las secuencias basándose en los valores máximos de cada tabla
 */
export class SequenceSyncUtil {
  static assertAllowedTable(tableName: string): AllowedSyncTable {
    if (!ALLOWED_SYNC_TABLES.includes(tableName as AllowedSyncTable)) {
      throw new BadRequestException(
        `Tabla no permitida: ${tableName}. Tablas válidas: ${ALLOWED_SYNC_TABLES.join(', ')}`,
      );
    }
    return tableName as AllowedSyncTable;
  }

  /**
   * Sincroniza todas las secuencias de las tablas principales
   * Debe ejecutarse después de cargar datos manualmente en la BD
   */
  static async syncAllSequences(dataSource: DataSource): Promise<void> {
    for (const table of ALLOWED_SYNC_TABLES) {
      await this.syncSequenceForTable(dataSource, table);
    }
  }

  /**
   * Sincroniza la secuencia de una tabla específica
   * @param dataSource - Instancia de DataSource de TypeORM
   * @param tableName - Nombre de la tabla (debe estar en ALLOWED_SYNC_TABLES)
   */
  static async syncSequenceForTable(
    dataSource: DataSource,
    tableName: string,
  ): Promise<void> {
    const safeTable = this.assertAllowedTable(tableName);

    try {
      const sequenceName = `${safeTable}_id_seq`;

      const result = await dataSource.query(
        `SELECT MAX(id) as max_id FROM "${safeTable}"`,
      );

      const maxId = result[0]?.max_id || 0;
      const nextValue = maxId + 1;

      await dataSource.query(
        `ALTER SEQUENCE "${sequenceName}" RESTART WITH ${nextValue}`,
      );

      console.log(`✓ Secuencia ${sequenceName} sincronizada a: ${nextValue}`);
    } catch (error) {
      console.warn(
        `⚠ No se pudo sincronizar secuencia para tabla ${safeTable}: ${error.message}`,
      );
    }
  }

  /**
   * Verifica el estado actual de todas las secuencias
   * Útil para debugging
   */
  static async getSequenceStatus(dataSource: DataSource): Promise<
    Array<{
      table: string;
      maxId: number;
      sequenceValue: number;
      status: 'OK' | 'OUT_OF_SYNC';
    }>
  > {
    const status: Array<{
      table: string;
      maxId: number;
      sequenceValue: number;
      status: 'OK' | 'OUT_OF_SYNC';
    }> = [];

    for (const table of ALLOWED_SYNC_TABLES) {
      try {
        const sequenceName = `${table}_id_seq`;

        const maxResult = await dataSource.query(
          `SELECT MAX(id) as max_id FROM "${table}"`,
        );
        const maxId = maxResult[0]?.max_id || 0;

        const seqResult = await dataSource.query(
          `SELECT last_value FROM "${sequenceName}"`,
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
    tableName: string,
  ): Promise<{ success: boolean; message: string }> {
    const safeTable = this.assertAllowedTable(tableName);
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sequenceName = `${safeTable}_id_seq`;

      const result = await queryRunner.query(
        `SELECT MAX(id) as max_id FROM "${safeTable}"`,
      );
      const maxId = result[0]?.max_id || 0;
      const nextValue = maxId + 1;

      await queryRunner.query(
        `ALTER SEQUENCE "${sequenceName}" RESTART WITH ${nextValue}`,
      );

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: `Secuencia ${sequenceName} sincronizada exitosamente a: ${nextValue}`,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
