import { Repository } from 'typeorm';
import { Usuario } from '../../entities/usuario.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
export declare class UsersService {
    private usuarioRepository;
    constructor(usuarioRepository: Repository<Usuario>);
    create(createUserDto: CreateUserDto): Promise<Usuario>;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Usuario>>;
    findById(id: number): Promise<Usuario>;
    findByUsername(username: string): Promise<Usuario | null>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<Usuario>;
    remove(id: number): Promise<void>;
    activate(id: number): Promise<Usuario>;
}
