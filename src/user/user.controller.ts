import { CommentService } from './../comment/comment.service';
import { BadRequestException, Body, Controller, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import {
    CreateUserDto,
    CreateUserResponseDto,
    UpdateUserDto,
} from './dto/createUserDto';
import { UserService } from './user.service';
import {
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
} from '@nestjs/swagger';
import { LoginDto } from './dto/loginUserDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from './oss';
import path from 'path';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly commentService: CommentService,
    ) { }

    @ApiOperation({ summary: 'Create new user' })
    @ApiCreatedResponse({
        description: 'User created successfully',
        type: CreateUserResponseDto,
    })
    @Post()
    create(@Body() body: CreateUserDto) {
        return this.userService.createUser(body);
    }

    @ApiOperation({ summary: 'Login user' })
    @ApiCreatedResponse({
        description: 'User login successfully',
        type: LoginDto,
    })
    @Post('/login')
    login(@Body() body: LoginDto) {
        return this.userService.login(body);
    }

    @ApiOperation({ summary: 'Upload avatar image' })
    @ApiOkResponse()
    @Post('/upload/avatar')
    @UseInterceptors(FileInterceptor('file', {
        dest: 'upload',
        storage: storage,
        limits: {
            fileSize: 3 * 1024 * 1024
        },
        fileFilter(req, file, cb) {
            const extName = path.extname(file.originalname);
            if (['.png', '.jpg'].includes(extName)) {
                cb(null, true);
            }
            else {
                cb(new BadRequestException("Wrong image format"), false)
            }
        }
    }))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        return file.path;
    }

    @ApiOperation({ summary: 'Get all user' })
    @ApiOkResponse()
    @Get('all')
    findAll() {
        return 'All users';
    }

    @ApiOperation({ summary: 'Get user information by id' })
    @ApiOkResponse()
    @Get(':id')
    findUserById(@Param('id') id: number) {
        return this.userService.findOneById(id);
    }

    @ApiOperation({ summary: 'Get comment by user id' })
    @ApiOkResponse()
    @Get(':id/comment')
    getCommentByUserId(@Param('id') id: string) {
        return this.commentService.findUserComments(id);
    }

    @ApiOperation({ summary: 'Update user' })
    @ApiOkResponse({
        description: 'User updated successfully',
        type: CreateUserResponseDto,
    })
    @Put(':id')
    updateUser(@Param('id') id: number, @Body() body: UpdateUserDto) {
        return this.userService.updateUser(id, body);
    }
}
