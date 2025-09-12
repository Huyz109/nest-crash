import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'ormconfig';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './login.guard';
import { LogMiddleware } from './log.middleware';

@Module({
  imports: [UserModule, CommentModule, TypeOrmModule.forRoot(config)],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: LoginGuard
  }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(LogMiddleware).forRoutes("/*");
  }
}
