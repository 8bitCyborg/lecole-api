import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { AuthUtilsService } from './authUtils/auth.utils';
import { UsersService } from 'src/users/users.service';
@Injectable()
export class AuthService {
  constructor(
    private AuthUtilsService: AuthUtilsService,
    private userService: UsersService,
  ){};

  async Login(data: any, res: Response){
    try {
      const { login_id, password } = data;
      const user: any = await this.userService.findUser(login_id);
      console.log('user', user);
      if (!user) {
        return res.status(401).send({ 
          message: 'Incorrect Username or Password',
          status: 401,
        });
      };

      const isPasswordValid = await this.AuthUtilsService.verifyPassword(password, user.password);
      console.log(isPasswordValid);
      if (!isPasswordValid) {
        return res.status(401).send({ 
          message: 'Incorrect Username or Password',
          status: 401,
        });
      };

      return res.status(200).send({
        message: 'Login successful',
        status: 200,
        data: {
          ...user,
          access_token: await this.AuthUtilsService.tokenize(user._id, user.email),
        },
      });
      
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: error,
        status: 500,
      });
    };
  };


  async Register(data: any, res: Response){
    try {
      const user = await this.userService.createUser({
        ...data,
        email: data.email.toLowerCase(),
        password: await this.AuthUtilsService.hashPassword(data.password),
      });

      if (!user) {
        throw new UnauthorizedException('User already exists');
      };

      return res.status(200).send({
        message: 'Register successful',
        status: 200,
        data: {
          ...user,
          access_token: await this.AuthUtilsService.tokenize(user._id, user.email),
        },
      });
    } catch (error) {
      throw new UnauthorizedException(error);
    };
  };

};
