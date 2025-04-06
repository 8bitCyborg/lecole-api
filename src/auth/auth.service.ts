import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AuthUtilsService } from './authUtils/auth.utils';
@Injectable()
export class AuthService {
  constructor(
    private JwtService: JwtService,
    private AuthUtilsService: AuthUtilsService,
  ){};

  async Login(data: any, res: Response){
    try {
      const { login_id, password } = data;
    } catch (error) {
      
    };
  };

  async Register(data: any, res: Response){
    try {
      const { login_id, password } = data;
      return res.status(200).send({
        message: 'Register successful',
        status: 200,
        access_token: await this.AuthUtilsService.tokenize({
          _id: data?._id,
          email: data?.email,
        }),
      });
    } catch (error) {
      throw new UnauthorizedException(error);
    };
  };

};
