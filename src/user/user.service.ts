import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/createUserDto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>,
    ) {}

    async findOneById(id: number) {
        return await this.userRepo.findOne({
            where: {
                id
            }
        })
    }

    async createUser(createUserDto: CreateUserDto) {
        const user = await this.userRepo.create(createUserDto);
        return this.userRepo.save(user);
    }

    async updateUser(id: number, updateUserDto: UpdateUserDto) {
        return await this.userRepo.update(id, updateUserDto);
    }
}
