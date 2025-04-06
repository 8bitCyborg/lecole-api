import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {};


  @Post('login')
  login(
    @Body() body: any,
    @Res() res: Response,
  ) {
    console.log(body);
    return res.status(200).json({
      message: 'Login successful',
    });
  };

};
