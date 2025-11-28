export declare enum EstadoCaja {
    ABIERTA = "ABIERTA",
    CERRADA = "CERRADA"
}
export declare class Caja {
    id: number;
    fechaApertura: Date;
    fechaCierre: Date;
    montoInicial: number;
    totalVentas: number;
    totalGastos: number;
    montoFinal: number;
    cajero: string;
    estado: EstadoCaja;
    diferencia: number;
    desglosePorMetodo: any;
    observaciones: string;
    fechaCreacion: Date;
    fechaActualizacion: Date;
    get montoEsperado(): number;
}
