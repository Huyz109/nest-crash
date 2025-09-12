import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/createUserDto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dto/loginUserDto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
    ) { }

    async findOneById(id: number) {
        return await this.userRepo.findOne({
            where: {
                id,
            },
        });
    }

    async createUser(createUserDto: CreateUserDto) {
        const user = await this.userRepo.create(createUserDto);
        return this.userRepo.save(user);
    }

    async login(loginDto: LoginDto) {
        const user = await this.userRepo.findOne({
            where: {
                email: loginDto.email,
            },
        });
        if (!user) throw new BadRequestException("User not found");
        
        // Check password
        if (user.password !== loginDto.password) {
            throw new BadRequestException("Login failed")
        }

        return user;
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto) {
        return await this.userRepo.update(id, updateUserDto);
    }
}
