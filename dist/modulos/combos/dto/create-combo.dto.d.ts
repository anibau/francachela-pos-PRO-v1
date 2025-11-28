export declare class ProductoComboDto {
    productoId: number;
    cantidad: number;
}
export declare class CreateComboDto {
    nombre: string;
    descripcion?: string;
    productos: ProductoComboDto[];
    precioOriginal: number;
    precioCombo: number;
    puntosExtra?: number;
    active?: boolean;
}
