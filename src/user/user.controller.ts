import { CommentService } from './../comment/comment.service';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/createUserDto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService : UserService, 
        private readonly commentService: CommentService
    ) {}

    @Get('all')
    findAll() {
        return 'All users';
    };

    @Get(':id')
    findUserById(@Param("id") id: number) {
        return this.userService.findOneById(id);
    }

    @Post()
    create(@Body() body: CreateUserDto) {
        return this.userService.createUser(body);
    }

    @Get(':id/comment')
    getCommentByUserId(@Param('id') id:string) {
        return this.commentService.findUserComments(id);
    }

    @Put(':id')
    updateUser(@Param('id') id:number, @Body() body: UpdateUserDto) {
        return this.userService.updateUser(id, body);
    }
}
