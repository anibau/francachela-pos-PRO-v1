import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryService } from './delivery.service';
import { DeliveryController } from './delivery.controller';
import { Delivery } from '../../entities/delivery.entity';
import { Cliente } from '../../entities/cliente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery, Cliente])],
  controllers: [DeliveryController],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliveryModule {}

