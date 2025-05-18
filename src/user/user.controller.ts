import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';

@Controller('user')
export class UserController {
    @Get('all')
    findAll() {
        return 'All users';
    };

    @Get()
    findUserById(@Param("id") id:string) {
        return {
            user: {
                id: id
            }
        };
    }

    @Post()
    create(@Body() body: CreateUserDto) {
        return body;
    }
}
