import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from './logger/logger.module';
import config from 'ormconfig';

@Module({
  imports: [LoggerModule, UserModule, CommentModule, TypeOrmModule.forRoot(config)],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule{}
