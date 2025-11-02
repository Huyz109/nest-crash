import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'ormconfig';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentModule } from './comment/comment.module';
import { LoggerModule } from './logger/logger.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [LoggerModule, UserModule, CommentModule, TypeOrmModule.forRoot(config), JwtModule.register({
    global: true,
    secret: 'your_jwt_secret_key',
    signOptions: { expiresIn: '1h' },
  })],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }
