import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/authUtils/auth.guard';

@Controller('main')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
