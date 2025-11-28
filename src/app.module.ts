import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import * as entities from './entities';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductosModule } from './productos/productos.module';
import { ClientesModule } from './clientes/clientes.module';
import { VentasModule } from './ventas/ventas.module';
import { PromocionesModule } from './promociones/promociones.module';
import { CajaModule } from './caja/caja.module';
import { GastosModule } from './gastos/gastos.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
