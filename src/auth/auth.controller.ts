import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
// import ROUTES from 'src/utils/routes';
import { Public } from './authUtils/auth.guard';
// import ROUTES from '../utils/routes';
// @Controller(ROUTES.auth.parent)

const ROUTES = {
  auth: {
    parent: 'auth',
    login: 'login',
    register: 'register',
  },
  users: {
    parent: 'users',
  },
};

export default ROUTES;

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post(ROUTES.auth.login)
  login(@Body() body: any, @Res() res: Response) {
    res.cookie('lecole_token', 'kkjkjjjkj', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day\
      path: '/',
    });
    return this.authService.Login(body, res);
  }

  @Public()
  @Post(ROUTES.auth.register)
  register(@Body() body: any, @Res() res: Response) {
    return this.authService.Register(body, res);
  }
}
