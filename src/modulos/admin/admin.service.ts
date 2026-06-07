import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SequenceSyncUtil } from '../../common/utils/sequence-sync.util';

@Injectable()
export class AdminService {
  constructor(private dataSource: DataSource) {}

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
      throw new InternalServerErrorException(
        `Error al sincronizar secuencias: ${error.message}`,
      );
    }
  }

  async getSequenceStatus() {
    try {
      const status = await SequenceSyncUtil.getSequenceStatus(this.dataSource);
      return {
        success: true,
        timestamp: new Date(),
        sequences: status,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener estado de secuencias: ${error.message}`,
      );
    }
  }

  async syncSequenceForTable(tableName: string) {
    const result = await SequenceSyncUtil.syncSequenceTransactional(
      this.dataSource,
      tableName,
    );
    return {
      ...result,
      timestamp: new Date(),
    };
  }
}
