import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Usuario } from '../../entities/usuario.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            nombre: any;
            rol: any;
        };
    }>;
    getProfile(user: Usuario): {
        id: number;
        username: string;
        nombre: string;
        rol: import("../../entities/usuario.entity").UserRole;
        activo: boolean;
        fechaCreacion: Date;
    };
}
