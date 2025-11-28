import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { LoginDto } from './dto/login.dto';
import { Usuario } from '../../entities/usuario.entity';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            nombre: any;
            rol: any;
        };
    }>;
    validateToken(token: string): Promise<Usuario | null>;
}
