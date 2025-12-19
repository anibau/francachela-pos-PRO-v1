import { Module } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { WhatsappController } from './whatsapp.controller';
import { ClientesModule } from '../clientes/clientes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from 'src/entities';

@Module({
  imports: [ClientesModule, TypeOrmModule.forFeature([Cliente])],
  controllers: [WhatsappController],
  providers: [WhatsappService],
  exports: [WhatsappService],
})
export class WhatsappModule {}

