import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { TimeInterceptor } from './time.interceptor';

@Controller()
@UseInterceptors(TimeInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
