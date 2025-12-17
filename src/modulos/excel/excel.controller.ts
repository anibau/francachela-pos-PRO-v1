import { 
  Controller, 
  Get, 
  Query, 
  UseGuards, 
  Res,
  Header 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import type { Response } from 'express';
import { ExcelService } from './excel.service';
import { ExportVentasDto, TipoReporte } from './dto/export-ventas.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../entities/usuario.entity';

@ApiTags('Excel Export')
@Controller('excel')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Get('export-ventas')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Exportar ventas a Excel' })
  @ApiQuery({ name: 'fechaInicio', required: false, description: 'Fecha inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', required: false, description: 'Fecha fin (YYYY-MM-DD)' })
  @ApiQuery({ name: 'incluirDetalles', required: false, description: 'Incluir detalles de productos' })
  @ApiResponse({ status: 200, description: 'Archivo Excel generado exitosamente' })
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  async exportVentas(
    @Query() exportDto: ExportVentasDto,
    @Res() res: Response
  ) {
    exportDto.tipoReporte = TipoReporte.VENTAS;
    const buffer = await this.excelService.exportVentas(exportDto);
    
    const filename = `ventas_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.set({
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length.toString(),
    });
    
    res.end(buffer);
  }

  @Get('export-venta-pagos')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Exportar pagos de ventas a Excel' })
  @ApiQuery({ name: 'fechaInicio', required: false, description: 'Fecha inicio (YYYY-MM-DD HH:mm:ss)' })
  @ApiQuery({ name: 'fechaFin', required: false, description: 'Fecha fin (YYYY-MM-DD HH:mm:ss)' })
  @ApiResponse({ status: 200, description: 'Archivo Excel de pagos generado exitosamente' })
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  async exportVentaPagos(
    @Query() exportDto: ExportVentasDto,
    @Res() res: Response
  ) {
    const buffer = await this.excelService.exportVentaPagos(exportDto);
    
    const filename = `venta_pagos_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.set({
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length.toString(),
    });
    
    res.end(buffer);
  }

  @Get('export-productos')
  @Roles(UserRole.ADMIN, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Exportar productos a Excel' })
  @ApiResponse({ status: 200, description: 'Archivo Excel generado exitosamente' })
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  async exportProductos(@Res() res: Response) {
    const exportDto: ExportVentasDto = { tipoReporte: TipoReporte.PRODUCTOS };
    const buffer = await this.excelService.exportVentas(exportDto);
    
    const filename = `productos_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.set({
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length.toString(),
    });
    
    res.end(buffer);
  }

  @Get('export-clientes')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Exportar clientes a Excel' })
  @ApiResponse({ status: 200, description: 'Archivo Excel generado exitosamente' })
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  async exportClientes(@Res() res: Response) {
    const exportDto: ExportVentasDto = { tipoReporte: TipoReporte.CLIENTES };
    const buffer = await this.excelService.exportVentas(exportDto);
    
    const filename = `clientes_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.set({
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length.toString(),
    });
    
    res.end(buffer);
  }

  @Get('export-inventario')
  @Roles(UserRole.ADMIN, UserRole.INVENTARIOS)
  @ApiOperation({ summary: 'Exportar movimientos de inventario a Excel' })
  @ApiQuery({ name: 'fechaInicio', required: false, description: 'Fecha inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', required: false, description: 'Fecha fin (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Archivo Excel generado exitosamente' })
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  async exportInventario(
    @Query() exportDto: ExportVentasDto,
    @Res() res: Response
  ) {
    exportDto.tipoReporte = TipoReporte.INVENTARIO;
    const buffer = await this.excelService.exportVentas(exportDto);
    
    const filename = `inventario_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.set({
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length.toString(),
    });
    
    res.end(buffer);
  }

  @Get('export-delivery')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Exportar deliveries a Excel' })
  @ApiQuery({ name: 'fechaInicio', required: false, description: 'Fecha inicio (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', required: false, description: 'Fecha fin (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Archivo Excel generado exitosamente' })
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  async exportDelivery(
    @Query() exportDto: ExportVentasDto,
    @Res() res: Response
  ) {
    exportDto.tipoReporte = TipoReporte.DELIVERY;
    const buffer = await this.excelService.exportVentas(exportDto);
    
    const filename = `delivery_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.set({
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length.toString(),
    });
    
    res.end(buffer);
  }

  @Get('export-venta-pagos')
  @Roles(UserRole.ADMIN, UserRole.CAJERO)
  @ApiOperation({ summary: 'Exportar pagos de ventas a Excel' })
  @ApiQuery({ name: 'fechaInicio', required: false, description: 'Fecha inicio (YYYY-MM-DD HH:mm:ss)' })
  @ApiQuery({ name: 'fechaFin', required: false, description: 'Fecha fin (YYYY-MM-DD HH:mm:ss)' })
  @ApiResponse({ status: 200, description: 'Archivo Excel generado exitosamente' })
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  async exportVentaPagos(
    @Query() exportDto: ExportVentasDto,
    @Res() res: Response
  ) {
    exportDto.tipoReporte = TipoReporte.VENTA_PAGOS;
    const buffer = await this.excelService.exportVentas(exportDto);
    
    const filename = `venta_pagos_${new Date().toISOString().split('T')[0]}.xlsx`;
    res.set({
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': buffer.length.toString(),
    });
    
    res.end(buffer);
  }
}
