import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { Venta } from '../../entities/venta.entity';
import { VentaPago } from '../../entities/venta-pago.entity';
import { Cliente } from '../../entities/cliente.entity';
import { ProductosModule } from '../productos/productos.module';
import { ClientesModule } from '../clientes/clientes.module';
import { WhatsappModule } from '../whatsapp/whatsapp.module';
import { ValidationService } from '../../common/services/validation.service';
import { PuntosModule } from '../puntos/puntos.module';
import { InventarioModule } from '../inventario/inventario.module';
import { Producto } from '../../entities/producto.entity';
import { PromocionesModule } from '../promociones/promociones.module';
import { ConfigPuntosModule } from '../config-puntos/config-puntos.module';
import { VentaCalculoService } from './venta-calculo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, VentaPago, Cliente, Producto]),
    ProductosModule,
    ClientesModule,
    WhatsappModule,
    PuntosModule,
    InventarioModule,
    PromocionesModule,
    ConfigPuntosModule,
  ],
  controllers: [VentasController],
  providers: [VentasService, ValidationService, VentaCalculoService],
  exports: [VentasService, VentaCalculoService],
})
export class VentasModule {}
