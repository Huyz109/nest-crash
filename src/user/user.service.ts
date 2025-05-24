import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';

@Injectable()
export class UserService {
    findOneById(id: string) {
        return ({
            id,
        })
    }

    createUser(createUserDto: CreateUserDto) {
        return "User is created."
    }
}
