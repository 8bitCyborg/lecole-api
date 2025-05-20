import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { AuthUtilsService } from './authUtils/auth.utils';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { School } from 'src/schools/schemas/school.schema';
import { SchoolsService } from 'src/schools/schools.service';
import { ObjectId } from 'mongodb';

@Injectable()
export class AuthService {
  constructor(
    private AuthUtilsService: AuthUtilsService,
    private userService: UsersService,
    private schoolService: SchoolsService,
    // @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectModel(User.name) private userModel,
  ) {}

  async Login(data: any, res: Response) {
    try {
      const { email, password } = data;
      const user: any = await this.userService.findUser(email);
      console.log('User: ', user);
      if (!user) {
        return res.status(401).send({
          message: 'Incorrect Username or Password',
          status: 401,
        });
      }

      const isPasswordValid = await this.AuthUtilsService.verifyPassword(
        password,
        user.password,
      );

      console.log('is password valid: ', isPasswordValid);

      if (!isPasswordValid) {
        return res.status(401).send({
          message: 'Incorrect Username or Password',
          status: 401,
        });
      }

      const jwt = await this.AuthUtilsService.tokenize(
        user._id,
        user.email,
        user.schoolId,
      );

      res.cookie('lecole_token', jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      return res.status(200).send({
        message: 'Login successful',
        status: 200,
        data: {
          ...user,
          access_token: jwt,
        },
      });
      // return res.status(200).send({
      //   message: 'Login successful',
      //   status: 200,
      //   data: {
      //     ...user,
      //     access_token: await this.AuthUtilsService.tokenize(
      //       user._id,
      //       user.email,
      //     ),
      //   },
      // });
    } catch (error) {
      console.log('Error logging in', error);
      return res.status(500).send({
        message: error,
        status: 500,
      });
    }
  }

  async Register(data: any, res: Response) {
    try {
      console.log('Data Registered: ', data);

      const school = await this.schoolService.createSchool({
        ...data,
        founderFirstName: data.firstName,
        founderLastName: data.lastName,
      });

      const newId = new ObjectId();

      const user = await this.userService.createUser({
        ...data,
        _id: newId,
        schoolId: school._id,
        email: data.email.toLowerCase(),
        password: await this.AuthUtilsService.hashPassword(data.password),
        loginId:
          data.role.slice(0, 3).toUpperCase() +
          '-' +
          school.shortCode +
          '-' +
          newId.toString().slice(-3).toUpperCase(),
      });

      if (!user) {
        throw new UnauthorizedException('User already exists');
      }

      return res.status(200).send({
        message: 'Registration successful',
        status: 200,
        data: {
          ...user,
          access_token: await this.AuthUtilsService.tokenize(
            user._id,
            user.email,
            user.schoolId,
          ),
        },
      });
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
