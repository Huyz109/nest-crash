import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentModule } from './comment/comment.module';
import { LoggerModule } from './logger/logger.module';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './guards/login.guard';
import { PermissionGuard } from './guards/permission.guard';

@Module({
  imports: [LoggerModule, UserModule, CommentModule, TypeOrmModule.forRoot(config), JwtModule.register({
    global: true,
    secret: 'your_jwt_secret_key',
    signOptions: { expiresIn: '1h' },
  }), AdminModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: LoginGuard
  }, {
    provide: APP_GUARD,
    useClass: PermissionGuard
  }],
})

export class AppModule { }
