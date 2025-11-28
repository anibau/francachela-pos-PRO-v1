export declare class CreateProductoDto {
    productoDescripcion: string;
    codigoBarra: string;
    imagen?: string;
    costo: number;
    precio: number;
    precioMayoreo?: number;
    cantidadActual: number;
    cantidadMinima: number;
    proveedor?: string;
    categoria?: string;
    valorPuntos?: number;
    mostrar?: boolean;
    usaInventario?: boolean;
}
