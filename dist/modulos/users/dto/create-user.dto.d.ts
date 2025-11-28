import { UserRole } from '../../../entities/usuario.entity';
export declare class CreateUserDto {
    username: string;
    password: string;
    nombre: string;
    rol?: UserRole;
}
