import { Response } from 'express';
import { ExcelService } from './excel.service';
import { ExportVentasDto } from './dto/export-ventas.dto';
export declare class ExcelController {
    private readonly excelService;
    constructor(excelService: ExcelService);
    exportVentas(exportDto: ExportVentasDto, res: Response): Promise<void>;
    exportProductos(res: Response): Promise<void>;
    exportClientes(res: Response): Promise<void>;
    exportInventario(exportDto: ExportVentasDto, res: Response): Promise<void>;
    exportDelivery(exportDto: ExportVentasDto, res: Response): Promise<void>;
}
