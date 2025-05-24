import { CommentService } from './../comment/comment.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/createUserDto';
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
    findUserById(@Param("id") id:string) {
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
}
