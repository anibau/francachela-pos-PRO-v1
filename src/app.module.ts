import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import * as entities from './entities';
import { AuthModule } from './modulos/auth/auth.module';
import { UsersModule } from './modulos/users/users.module';
import { ProductosModule } from './modulos/productos/productos.module';
import { ClientesModule } from './modulos/clientes/clientes.module';
import { VentasModule } from './modulos/ventas/ventas.module';
import { PromocionesModule } from './modulos/promociones/promociones.module';
import { CajaModule } from './modulos/caja/caja.module';
import { GastosModule } from './modulos/gastos/gastos.module';
import { DeliveryModule } from './modulos/delivery/delivery.module';
import { MovimientoInventarioModule } from './modulos/movimiento-inventario/movimiento-inventario.module';
import { WhatsappModule } from './modulos/whatsapp/whatsapp.module';
import { ExcelModule } from './modulos/excel/excel.module';
import { SeederModule } from './database/seeders/seeder.module';
import { AdminModule } from './modulos/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: Object.values(entities),
        synchronize: configService.get('database.synchronize'),
        logging: configService.get('database.logging'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    ProductosModule,
    ClientesModule,
    VentasModule,
    PromocionesModule,
    CajaModule,
    GastosModule,
    DeliveryModule,
    MovimientoInventarioModule,
    WhatsappModule,
    ExcelModule,
    SeederModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
