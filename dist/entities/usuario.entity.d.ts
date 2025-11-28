export declare enum UserRole {
    ADMIN = "ADMIN",
    CAJERO = "CAJERO",
    INVENTARIOS = "INVENTARIOS"
}
export declare class Usuario {
    id: number;
    username: string;
    password: string;
    rol: UserRole;
    nombre: string;
    activo: boolean;
    fechaCreacion: Date;
    fechaActualizacion: Date;
}
