import { Repository } from 'typeorm';
import { Venta } from '../../entities/venta.entity';
import { Producto } from '../../entities/producto.entity';
import { Cliente } from '../../entities/cliente.entity';
import { MovimientoInventario } from '../../entities/movimiento-inventario.entity';
import { Delivery } from '../../entities/delivery.entity';
import { ExportVentasDto } from './dto/export-ventas.dto';
export declare class ExcelService {
    private ventaRepository;
    private productoRepository;
    private clienteRepository;
    private movimientoRepository;
    private deliveryRepository;
    constructor(ventaRepository: Repository<Venta>, productoRepository: Repository<Producto>, clienteRepository: Repository<Cliente>, movimientoRepository: Repository<MovimientoInventario>, deliveryRepository: Repository<Delivery>);
    exportVentas(exportDto: ExportVentasDto): Promise<Buffer>;
    private createVentasSheet;
    private createProductosSheet;
    private createClientesSheet;
    private createInventarioSheet;
    private createDeliverySheet;
}
