import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../../entities/usuario.entity';

import { 
  UserRole
} from '../../common/enums';

@Injectable()
export class DatabaseSeeder {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async seed() {
    this.logger.log('🌱 Iniciando población de base de datos...');

    try {
      await this.seedUsuarios();

      this.logger.log('✅ Base de datos poblada exitosamente');
    } catch (error) {
      this.logger.error('❌ Error poblando base de datos:', error);
      throw error;
    }
  }

  private async seedUsuarios() {
    this.logger.log('👥 Creando usuarios...');
    
    const usuarios = [
      {
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),
        rol: UserRole.ADMIN,
        nombre: 'Administrador Principal'
      },
      {
        username: 'cajero1',
        password: await bcrypt.hash('cajero123', 10),
        rol: UserRole.CAJERO,
        nombre: 'María González'
      },
      {
        username: 'cajero2',
        password: await bcrypt.hash('cajero123', 10),
        rol: UserRole.CAJERO,
        nombre: 'Carlos Rodríguez'
      },
      {
        username: 'inventarios',
        password: await bcrypt.hash('inv123', 10),
        rol: UserRole.INVENTARIOS,
        nombre: 'Ana Martínez'
      },
      {
        username: 'supervisor',
        password: await bcrypt.hash('super123', 10),
        rol: UserRole.ADMIN,
        nombre: 'Luis Supervisor'
      }
    ];

    for (const userData of usuarios) {
      const existingUser = await this.usuarioRepository.findOne({
        where: { username: userData.username }
      });
      
      if (!existingUser) {
        await this.usuarioRepository.save(userData);
      }
    }
  }

}
