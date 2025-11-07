import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/createUserDto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/loginUserDto';
import { createHash } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { stat } from 'fs';

function md5(input: string): string {
    const hash = createHash('md5');
    hash.update(input);
    return hash.digest('hex');
}

@Injectable()
export class UserService {
    @InjectRepository(User)
    private readonly userRepo: Repository<User>;

    @Inject(JwtService)
    private readonly jwtService: JwtService;

    async findOneById(id: number) {
        return await this.userRepo.findOne({
            where: {
                id,
            },
        });
    }

    async createUser(user: CreateUserDto) {
        const existingUser = await this.userRepo.findOne({
            where: {
                email: user.email,
            },
        });
        if (existingUser) {
            throw new BadRequestException("User with this email already exists");
        }

        const newUser = new User();
        newUser.email = user.email;
        newUser.password = md5(user.password);
        newUser.name = user.name;

        try {
            return await this.userRepo.save(newUser);
        } catch (error) {
            throw new BadRequestException("Failed to create user");
        }
    }

    async login(user: LoginDto) {
        const existingUser = await this.userRepo.findOne({
            where: {
                email: user.email,
            },
        });
        if (!existingUser) throw new BadRequestException("User not found");

        // Check password
        if (existingUser.password !== md5(user.password)) {
            throw new BadRequestException("Login failed")
        }

        // Generate JWT token
        const payload = { email: existingUser.email, id: existingUser.id, iat: Math.floor(Date.now() / 1000) };
        const token = this.jwtService.sign(payload);

        return {
            status: 'success',
            data: {
                user: existingUser,
                token: token,
            },
        };
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto) {
        return await this.userRepo.update(id, updateUserDto);
    }

    async deleteUser(id: number) {
        return await this.userRepo.delete(id);
    }

    async getRolesByUserId(id: number) {
        const user = await this.userRepo.findOne({
            where: { id },
            relations: ['roles'],
        });
        return user?.roles || [];
    }
}
