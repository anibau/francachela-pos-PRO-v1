import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("../../entities/usuario.entity").Usuario>;
    findAll(paginationDto: PaginationDto): Promise<import("../../common/interfaces/paginated-result.interface").PaginatedResult<import("../../entities/usuario.entity").Usuario>>;
    findOne(id: number): Promise<import("../../entities/usuario.entity").Usuario>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<import("../../entities/usuario.entity").Usuario>;
    remove(id: number): Promise<void>;
    activate(id: number): Promise<import("../../entities/usuario.entity").Usuario>;
}
