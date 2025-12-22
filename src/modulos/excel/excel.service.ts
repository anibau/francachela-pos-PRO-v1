import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { Venta } from '../../entities/venta.entity';
import { VentaPago } from '../../entities/venta-pago.entity';
import { Producto } from '../../entities/producto.entity';
import { Cliente } from '../../entities/cliente.entity';
import { MovimientoInventario } from '../../entities/movimiento-inventario.entity';
import { Delivery } from '../../entities/delivery.entity';
import { ExportVentasDto, TipoReporte } from './dto/export-ventas.dto';

@Injectable()
export class ExcelService {
  private readonly logger = new Logger(ExcelService.name);

  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    @InjectRepository(VentaPago)
    private ventaPagoRepository: Repository<VentaPago>,
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
    @InjectRepository(Cliente)
    private clienteRepository: Repository<Cliente>,
    @InjectRepository(MovimientoInventario)
    private movimientoRepository: Repository<MovimientoInventario>,
    @InjectRepository(Delivery)
    private deliveryRepository: Repository<Delivery>,
  ) {}

  async exportVentas(exportDto: ExportVentasDto): Promise<Buffer> {
    try {
      this.logger.log(`Generando reporte Excel: ${exportDto.tipoReporte || TipoReporte.VENTAS}`);
      const workbook = new ExcelJS.Workbook();
      
      switch (exportDto.tipoReporte || TipoReporte.VENTAS) {
        case TipoReporte.VENTAS:
          await this.createVentasSheet(workbook, exportDto);
          break;
        case TipoReporte.PRODUCTOS:
          await this.createProductosSheet(workbook);
          break;
        case TipoReporte.CLIENTES:
          await this.createClientesSheet(workbook);
          break;
        case TipoReporte.INVENTARIO:
          await this.createInventarioSheet(workbook, exportDto);
          break;
        case TipoReporte.DELIVERY:
          await this.createDeliverySheet(workbook, exportDto);
          break;
        case TipoReporte.VENTA_PAGOS:
          await this.createVentaPagosSheet(workbook, exportDto);
          break;
        default:
          throw new Error(`Tipo de reporte no soportado: ${exportDto.tipoReporte}`);
      }

      this.logger.log('Reporte Excel generado exitosamente');
      return await workbook.xlsx.writeBuffer() as unknown as Buffer;
    } catch (error) {
      this.logger.error('Error generando reporte Excel:', error);
      throw new InternalServerErrorException('Error generando archivo Excel: ' + error.message);
    }
  }

  private async createVentasSheet(workbook: ExcelJS.Workbook, exportDto: ExportVentasDto) {
    const worksheet = workbook.addWorksheet('Ventas');

    // Configurar filtros de fecha
    const whereCondition: any = {};
    if (exportDto.fechaInicio && exportDto.fechaFin) {
      whereCondition.fecha = Between(new Date(exportDto.fechaInicio), new Date(exportDto.fechaFin));
    }

    const ventas = await this.ventaRepository.find({
      where: whereCondition,
      relations: ['cliente', 'pagos'],
      order: { fecha: 'DESC' }
    });
    const ventasValidas = ventas.filter(
        v => v.estado === 'COMPLETADO'
      );

    // Headers
    const headers = [
      'ID', 'Fecha', 'Cliente', 'DNI Cliente', 'Subtotal', 'Descuento', 
      'Recargo Extra', 'Total', 'Ajuste Redondeo', 'Total Cobrado', 'Métodos Pago', 'Cajero', 'Estado', 'Puntos Otorgados', 
      'Puntos Usados', 'Tipo Compra', 'Comentario'
    ];

    if (exportDto.incluirDetalles) {
      headers.push('Productos', 'Cantidades', 'Precios');
    }

    worksheet.addRow(headers);

    // Estilo para headers
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6FA' }
    };

    // Datos
    ventas.forEach(venta => {
      // Formatear métodos de pago desde la relación pagos
      const metodosPago = venta.pagos && venta.pagos.length > 0 
        ? venta.pagos.map(pago => `${pago.metodoPago}: S/ ${pago.monto.toFixed(2)}`).join(', ')
        : 'Sin pagos registrados';

      const row = [
        venta.id,
        venta.fecha.toLocaleDateString(),
        venta.cliente ? `${venta.cliente.nombres} ${venta.cliente.apellidos}` : 'Sin cliente',
        venta.cliente?.dni || '',
        venta.subTotal,
        venta.descuento,
        venta.recargoExtra || 0,
        venta.total,
        venta.ajusteRedondeo || 0,
        venta.totalCobrado,
        metodosPago,
        venta.cajero,
        venta.estado,
        venta.puntosOtorgados,
        venta.puntosUsados,
        venta.tipoCompra,
        venta.comentario || ''
      ];

      if (exportDto.incluirDetalles && venta.listaProductos) {
        const productos = venta.listaProductos.map((p: any) => p.descripcion || p.nombre).join(', ');
        const cantidades = venta.listaProductos.map((p: any) => p.cantidad).join(', ');
        const precios = venta.listaProductos.map((p: any) => p.precio).join(', ');
        
        row.push(productos, cantidades, precios);
      }

     const rowRef = worksheet.addRow(row);

      if (venta.estado === 'ANULADO') {
        rowRef.font = { color: { argb: 'FFFF0000' } };
      }

    });

    // Auto-ajustar columnas
    worksheet.columns.forEach(column => {
      column.width = 15;
    });

    

    // Agregar totales - asegurar operaciones numéricas
        const totalSubtotal = ventasValidas.reduce((sum, v) => {
      const subtotal = Number(v.subTotal) || 0;
      return sum + subtotal;
    }, 0);

    const totalDescuento = ventasValidas.reduce((sum, v) => {
      const descuento = Number(v.descuento) || 0;
      return sum + descuento;
    }, 0);

    const totalRecargoExtra = ventasValidas.reduce((sum, v) => {
      const recargo = Number(v.recargoExtra) || 0;
      return sum + recargo;
    }, 0);

    const totalTotal = ventasValidas.reduce((sum, v) => {
      const total = Number(v.total) || 0;
      return sum + total;
    }, 0);

    const totalPuntosOtorgados = ventasValidas.reduce(
      (sum, v) => sum + (v.puntosOtorgados || 0),
      0
    );

    const totalPuntosUsados = ventasValidas.reduce(
      (sum, v) => sum + (v.puntosUsados || 0),
      0
    );
    const totalRow = worksheet.addRow([
      '', '', '', 'TOTALES:', 
      totalSubtotal,
      totalDescuento,
      totalRecargoExtra,
      totalTotal,
      '', '', '', 
      totalPuntosOtorgados,
      totalPuntosUsados
    ]);
    
    totalRow.font = { bold: true };
    totalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFD700' }
    };
  }

  private async createProductosSheet(workbook: ExcelJS.Workbook) {
    const worksheet = workbook.addWorksheet('Productos');
    
    const productos = await this.productoRepository.find({
      order: { productoDescripcion: 'ASC' }
    });

    const headers = [
      'ID', 'Descripción', 'Código Barras', 'Costo', 'Precio', 'Precio Mayoreo',
      'Stock Actual', 'Stock Mínimo', 'Proveedor', 'Categoría', 'Valor Puntos',
      'Mostrar', 'Usa Inventario'
    ];

    worksheet.addRow(headers);

    // Estilo headers
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6FA' }
    };

    productos.forEach(producto => {
      worksheet.addRow([
        producto.id,
        producto.productoDescripcion,
        producto.codigoBarra,
        producto.costo,
        producto.precio,
        producto.precioMayoreo,
        producto.cantidadActual,
        producto.cantidadMinima,
        producto.proveedor,
        producto.categoria,
        producto.valorPuntos,
        producto.mostrar ? 'Sí' : 'No',
        producto.usaInventario ? 'Sí' : 'No'
      ]);
    });

    worksheet.columns.forEach(column => {
      column.width = 15;
    });
  }

  private async createClientesSheet(workbook: ExcelJS.Workbook) {
    try {
      this.logger.log('Generando hoja de clientes...');
      const worksheet = workbook.addWorksheet('Clientes');
      
      const clientes = await this.clienteRepository.find({
        order: { fechaRegistro: 'DESC' }
      });

      this.logger.log(`Procesando ${clientes.length} clientes`);

      const headers = [
        'ID', 'Nombres', 'Apellidos', 'DNI', 'Fecha Nacimiento', 'Teléfono',
        'Fecha Registro', 'Puntos Acumulados', 'Código Corto', 'Dirección'
      ];

      worksheet.addRow(headers);

      const headerRow = worksheet.getRow(1);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE6E6FA' }
      };

      clientes.forEach((cliente, index) => {
        try {
          // Validar y limpiar datos antes de agregar a Excel
          const row = [
            cliente.id || '',
            this.sanitizeString(cliente.nombres) || '',
            this.sanitizeString(cliente.apellidos) || '',
            this.sanitizeString(cliente.dni) || '',
            cliente.fechaNacimiento ? this.formatDate(cliente.fechaNacimiento) : '',
            this.sanitizeString(cliente.telefono) || '',
            cliente.fechaRegistro ? this.formatDate(cliente.fechaRegistro) : '',
            cliente.puntosAcumulados || 0,
            this.sanitizeString(cliente.codigoCorto) || '',
            this.sanitizeString(cliente.direccion) || ''
          ];
          
          worksheet.addRow(row);
        } catch (error) {
          this.logger.warn(`Error procesando cliente ${cliente.id} en fila ${index + 2}:`, error);
          // Agregar fila con datos básicos en caso de error
          worksheet.addRow([
            cliente.id || '',
            'ERROR EN DATOS',
            '',
            cliente.dni || '',
            '',
            '',
            '',
            0,
            '',
            ''
          ]);
        }
      });

      worksheet.columns.forEach(column => {
        column.width = 15;
      });
      
      this.logger.log('Hoja de clientes generada exitosamente');
    } catch (error) {
      this.logger.error('Error generando hoja de clientes:', error);
      throw new Error('Error procesando datos de clientes: ' + error.message);
    }
  }

  /**
   * Sanitiza strings para evitar problemas en Excel
   */
  private sanitizeString(value: any): string {
    if (value === null || value === undefined) {
      return '';
    }
    
    return String(value)
      .replace(/[\x00-\x1F\x7F]/g, '') // Remover caracteres de control
      .trim();
  }

  /**
   * Formatea fechas de manera segura
   */
  private formatDate(date: Date | string): string {
    try {
      if (!date) return '';
      
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      
      if (isNaN(dateObj.getTime())) {
        return '';
      }
      
      return dateObj.toLocaleDateString();
    } catch (error) {
      this.logger.warn('Error formateando fecha:', error);
      return '';
    }
  }

  private async createInventarioSheet(workbook: ExcelJS.Workbook, exportDto: ExportVentasDto) {
    const worksheet = workbook.addWorksheet('Movimientos Inventario');
    
    const whereCondition: any = {};
    if (exportDto.fechaInicio && exportDto.fechaFin) {
      whereCondition.hora = Between(new Date(exportDto.fechaInicio), new Date(exportDto.fechaFin));
    }

    const movimientos = await this.movimientoRepository.find({
      where: whereCondition,
      order: { hora: 'DESC' }
    });

    const headers = [
      'ID', 'Fecha/Hora', 'Código Barras', 'Descripción', 'Tipo', 'Cantidad',
      'Costo', 'Precio Venta', 'Existencia', 'Inv. Mínimo', 'Cajero', 'Proveedor'
    ];

    worksheet.addRow(headers);

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6FA' }
    };

    movimientos.forEach(movimiento => {
      worksheet.addRow([
        movimiento.id,
        movimiento.hora.toLocaleString(),
        movimiento.codigoBarra,
        movimiento.descripcion,
        movimiento.tipo,
        movimiento.cantidad,
        movimiento.costo,
        movimiento.precioVenta,
        movimiento.existencia,
        movimiento.invMinimo,
        movimiento.cajero,
        movimiento.proveedor
      ]);
    });

    worksheet.columns.forEach(column => {
      column.width = 15;
    });
  }

  private async createDeliverySheet(workbook: ExcelJS.Workbook, exportDto: ExportVentasDto) {
    const worksheet = workbook.addWorksheet('Delivery');
    
    const whereCondition: any = {};
    if (exportDto.fechaInicio && exportDto.fechaFin) {
      whereCondition.fecha = Between(new Date(exportDto.fechaInicio), new Date(exportDto.fechaFin));
    }

    const deliveries = await this.deliveryRepository.find({
      where: whereCondition,
      relations: ['cliente'],
      order: { fecha: 'DESC' }
    });

    const headers = [
      'ID', 'Fecha', 'Cliente', 'Teléfono', 'Dirección', 'Estado', 'Repartidor',
      'Hora Salida', 'Hora Entrega', 'Costo Delivery', 'Pedido ID', 'Notas'
    ];

    worksheet.addRow(headers);

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6FA' }
    };

    deliveries.forEach(delivery => {
      worksheet.addRow([
        delivery.id,
        delivery.fecha.toLocaleDateString(),
        delivery.cliente ? `${delivery.cliente.nombres} ${delivery.cliente.apellidos}` : 'Sin cliente',
        delivery.phone,
        delivery.direccion,
        delivery.estado,
        delivery.repartidor,
        delivery.horaSalida,
        delivery.horaEntrega,
        delivery.deliveryFee,
        delivery.pedidoId,
        delivery.notes
      ]);
    });

    worksheet.columns.forEach(column => {
      column.width = 15;
    });
  }

  private async createVentaPagosSheet(workbook: ExcelJS.Workbook, exportDto: ExportVentasDto) {
    const worksheet = workbook.addWorksheet('Venta Pagos');

    // Configurar filtros de fecha
    const whereCondition: any = {};
    if (exportDto.fechaInicio && exportDto.fechaFin) {
      whereCondition.fechaRegistro = Between(new Date(exportDto.fechaInicio), new Date(exportDto.fechaFin));
    }

    const ventaPagos = await this.ventaPagoRepository.find({
      where: whereCondition,
      relations: ['venta', 'venta.cliente'],
      order: { fechaRegistro: 'DESC' }
    });

    const pagosValidos = ventaPagos.filter(
      pago => pago.estado === 'COMPLETADO'
    );


    // Headers
    const headers = [
      'ID Pago', 'ID Venta', 'Ticket ID', 'Fecha Venta', 'Cliente', 'DNI Cliente',
      'Método Pago', 'Monto', 'Referencia', 'Estado Pago', 'Notas', 
      'Fecha Registro', 'Registrado Por', 'Secuencia'
    ];

    worksheet.addRow(headers);

    // Estilo para headers
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6FA' }
    };

    // Datos
    ventaPagos.forEach(pago => {
      
      const row = [
        pago.id,
        pago.ventaId,
        pago.venta?.ticketId || '',
        pago.venta?.fecha ? pago.venta.fecha.toLocaleDateString() : '',
        pago.venta?.cliente ? `${pago.venta.cliente.nombres} ${pago.venta.cliente.apellidos}` : 'Sin cliente',
        pago.venta?.cliente?.dni || '',
        pago.metodoPago,
        pago.monto,
        pago.referencia || '',
        pago.estado,
        pago.notas || '',
        pago.fechaRegistro.toLocaleString(),
        pago.registradoPor,
        pago.secuencia
      ];

      const rowRef = worksheet.addRow(row);

      if (pago.estado === 'ANULADO') {
        rowRef.font = { color: { argb: 'FFFF0000' } };
      }

    });

    
    // Auto-ajustar columnas
    worksheet.columns.forEach(column => {
      column.width = 15;
    });

    // Agregar totales por método de pago
    const totalesPorMetodo = pagosValidos.reduce((acc, pago) => {
        if (!pago.metodoPago) return acc;

        if (!acc[pago.metodoPago]) {
          acc[pago.metodoPago] = { cantidad: 0, monto: 0 };
        }

        acc[pago.metodoPago].cantidad += 1;
        acc[pago.metodoPago].monto += Number(pago.monto);

        return acc;
      }, {} as { [key: string]: { cantidad: number; monto: number } });


    // Agregar fila vacía
    worksheet.addRow([]);

    // Agregar resumen por método de pago
    worksheet.addRow(['RESUMEN POR MÉTODO DE PAGO']);
    const resumenHeaderRow = worksheet.getRow(worksheet.rowCount);
    resumenHeaderRow.font = { bold: true };
    resumenHeaderRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFD700' }
    };

    worksheet.addRow(['Método', 'Cantidad', 'Monto Total']);
    const subHeaderRow = worksheet.getRow(worksheet.rowCount);
    subHeaderRow.font = { bold: true };

    Object.entries(totalesPorMetodo).forEach(([metodo, datos]) => {
      worksheet.addRow([metodo, datos.cantidad, datos.monto.toFixed(2)]);
    });

    // Total general
    const totalGeneral = Object.values(totalesPorMetodo).reduce((sum, datos) => sum + datos.monto, 0);
    const totalRow = worksheet.addRow(['TOTAL GENERAL', '', totalGeneral.toFixed(2)]);
    totalRow.font = { bold: true };
    totalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFF6347' }
    };
  }

}
