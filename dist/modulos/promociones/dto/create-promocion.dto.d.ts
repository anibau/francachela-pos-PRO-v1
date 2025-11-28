import { TipoPromocion } from '../../../entities/promocion.entity';
export declare class CreatePromocionDto {
    nombre: string;
    descripcion?: string;
    tipo: TipoPromocion;
    descuento: number;
    fechaInicio: Date;
    fechaFin: Date;
    productosAplicables?: number[];
    montoMinimo?: number;
    cantidadMaximaUsos?: number;
    activo?: boolean;
}
