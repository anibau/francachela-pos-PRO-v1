import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SequenceSyncUtil } from '../../common/utils/sequence-sync.util';

@Injectable()
export class AdminService {
  constructor(private dataSource: DataSource) {}

  /**
   * Sincroniza todas las secuencias de la base de datos
   * Esto es necesario después de cargar datos manualmente
   */
  async syncAllSequences(): Promise<{
    success: boolean;
    message: string;
    timestamp: Date;
  }> {
    try {
      await SequenceSyncUtil.syncAllSequences(this.dataSource);
      return {
        success: true,
        message: 'Todas las secuencias se sincronizaron exitosamente',
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al sincronizar secuencias: ${error.message}`,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Obtiene el estado actual de todas las secuencias
   */
  async getSequenceStatus() {
    try {
      const status = await SequenceSyncUtil.getSequenceStatus(this.dataSource);
      return {
        success: true,
        timestamp: new Date(),
        sequences: status,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al obtener estado de secuencias: ${error.message}`,
        timestamp: new Date(),
      };
    }
  }

  /**
   * Sincroniza la secuencia de una tabla específica
   */
  async syncSequenceForTable(tableName: string) {
    try {
      const result = await SequenceSyncUtil.syncSequenceTransactional(
        this.dataSource,
        tableName
      );
      return {
        ...result,
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        message: `Error al sincronizar tabla ${tableName}: ${error.message}`,
        timestamp: new Date(),
      };
    }
  }
}
