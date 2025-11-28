"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const usuario_entity_1 = require("../../entities/usuario.entity");
let UsersService = class UsersService {
    usuarioRepository;
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    async create(createUserDto) {
        const existingUser = await this.usuarioRepository.findOne({
            where: { username: createUserDto.username },
        });
        if (existingUser) {
            throw new common_1.ConflictException('El nombre de usuario ya existe');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.usuarioRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });
        return this.usuarioRepository.save(user);
    }
    async findAll(paginationDto) {
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
    async findById(id) {
        const user = await this.usuarioRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        return user;
    }
    async findByUsername(username) {
        return this.usuarioRepository.findOne({ where: { username } });
    }
    async update(id, updateUserDto) {
        const user = await this.findById(id);
        if (updateUserDto.username && updateUserDto.username !== user.username) {
            const existingUser = await this.usuarioRepository.findOne({
                where: { username: updateUserDto.username },
            });
            if (existingUser) {
                throw new common_1.ConflictException('El nombre de usuario ya existe');
            }
        }
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        await this.usuarioRepository.update(id, updateUserDto);
        return this.findById(id);
    }
    async remove(id) {
        const user = await this.findById(id);
        await this.usuarioRepository.update(id, { activo: false });
    }
    async activate(id) {
        await this.usuarioRepository.update(id, { activo: true });
        return this.findById(id);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.Usuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map