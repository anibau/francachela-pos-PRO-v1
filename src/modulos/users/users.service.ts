import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../../entities/usuario.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Usuario> {
    const existingUser = await this.usuarioRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new ConflictException('El nombre de usuario ya existe');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usuarioRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.usuarioRepository.save(user);
  }

  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Usuario>> {
    const { page, limit, skip } = paginationDto;

    const [data, total] = await this.usuarioRepository.findAndCount({
      skip,
      take: limit,
      order: { fechaCreacion: 'DESC' },
    });

    const totalPages = Math.ceil(total / (limit || 10));

    return {
      data,
      total,
      page: page || 1,
      limit: limit || 10,
      totalPages,
      hasNextPage: (page || 1) < totalPages,
      hasPrevPage: (page || 1) > 1,
    };
  }

  async findById(id: number): Promise<Usuario> {
    const user = await this.usuarioRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async findByUsername(username: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { username } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Usuario> {
    const user = await this.findById(id);

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.usuarioRepository.findOne({
        where: { username: updateUserDto.username },
      });
      if (existingUser) {
        throw new ConflictException('El nombre de usuario ya existe');
      }
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.usuarioRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    await this.usuarioRepository.update(id, { activo: false });
  }

  async activate(id: number): Promise<Usuario> {
    await this.usuarioRepository.update(id, { activo: true });
    return this.findById(id);
  }
}
