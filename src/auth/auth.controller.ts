import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import ROUTES from 'src/utils/routes';

@Controller(ROUTES.auth.parent)
export class AuthController {
  constructor(private readonly authService: AuthService) {};


  @Post(ROUTES.auth.login)
  login(
    @Body() body: any,
    @Res() res: Response,
  ) {
    console.log(body);
    return res.status(200).send({
      message: 'Login successful',
    });
  };

  @Post(ROUTES.auth.register)
  register(
    @Body() body: any,
    @Res() res: Response,
  ) {
    console.log(body);
    return this.authService.Register(body, res);
  };

};
