import { CommentService } from './../comment/comment.service';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto, CreateUserResponseDto, UpdateUserDto } from './dto/createUserDto';
import { UserService } from './user.service';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService : UserService, 
        private readonly commentService: CommentService
    ) {}

    @ApiOperation({summary: "Get all user"})
    @ApiOkResponse()
    @Get('all')
    findAll() {
        return 'All users';
    };

    @ApiOperation({summary: "Get user information by id"})
    @ApiOkResponse()
    @Get(':id')
    findUserById(@Param("id") id: number) {
        return this.userService.findOneById(id);
    }

    @ApiOperation({summary: "Create new user"})
    @ApiCreatedResponse({
        description: "User created successfully",
        type: CreateUserResponseDto
    })
    @Post()
    create(@Body() body: CreateUserDto) {
        return this.userService.createUser(body);
    }

    @ApiOperation({summary: "Get comment by user id"})
    @ApiOkResponse()
    @Get(':id/comment')
    getCommentByUserId(@Param('id') id:string) {
        return this.commentService.findUserComments(id);
    }

    @ApiOperation({summary: "Update user"})
    @ApiOkResponse({
        description: "User updated successfully",
        type: CreateUserResponseDto
    })
    @Put(':id')
    updateUser(@Param('id') id:number, @Body() body: UpdateUserDto) {
        return this.userService.updateUser(id, body);
    }
}
