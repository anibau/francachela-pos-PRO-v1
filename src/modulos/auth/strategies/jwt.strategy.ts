import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret')!,
    });
  }

  async validate(payload: { sub?: number; username?: string }) {
    if (!payload.sub || !payload.username) {
      throw new UnauthorizedException();
    }

    let user;
    try {
      user = await this.usersService.findById(payload.sub);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Usuario no encontrado');
      }
      throw error;
    }

    if (!user.activo) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    return {
      id: user.id,
      username: user.username,
      nombre: user.nombre,
      rol: user.rol,
      activo: user.activo,
    };
  }
}
