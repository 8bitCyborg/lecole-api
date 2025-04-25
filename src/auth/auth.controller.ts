import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import ROUTES from 'src/utils/routes';
import { Public } from './authUtils/auth.guard';
@Controller(ROUTES.auth.parent)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post(ROUTES.auth.login)
  login(@Body() body: any, @Res() res: Response) {
    return this.authService.Login(body, res);
  }

  @Public()
  @Post(ROUTES.auth.register)
  register(@Body() body: any, @Res() res: Response) {
    console.log('register');
    return this.authService.Register(body, res);
  }
}
