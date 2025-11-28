export declare class Cliente {
    id: number;
    nombres: string;
    apellidos: string;
    dni: string;
    fechaNacimiento: Date;
    telefono: string;
    fechaRegistro: Date;
    puntosAcumulados: number;
    historialCompras: any[];
    historialCanjes: any[];
    codigoCorto: string;
    direccion: string;
    activo: boolean;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    get nombreCompleto(): string;
}
