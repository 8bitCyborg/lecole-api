import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel) {} // private usersRepository: Repository<Users>, // @InjectRepository(Users)

  // async findUser(login_id: string) {
  //   try {
  //     const user = await this.usersRepository.find({
  //       where: {
  //         // @ts-ignore
  //         $or: [{ username: login_id }, { email: login_id }],
  //       },
  //     });
  //     if (user.length > 0) return user[0];
  //     return false;
  //   } catch (error) {
  //     console.log('error finding user: ', error);
  //     return false;
  //   }
  // }

  async findUser(login_id: string) {
    // try {
    //   const user = await this.userModel.find({ email: login_id });
    //   return user;
    // } catch (error) {
    //   console.log('Error finding User');
    //   return error;
    // }

    const user = await this.userModel.find({ email: login_id });
    return user;
  }

  async createUser(data: UserDto) {
    try {
      const checkIfUserExists = await this.userModel.findOne({
        email: data.email,
      });

      console.log('Hello world');
      console.log(checkIfUserExists);

      if (checkIfUserExists) return false;

      const user = await this.userModel.create(data);
      console.log('User:  ', user);
      return user;
    } catch (error) {
      console.log('Error creating user: ', error);
    }
  }

  // async createUser(data: UserDto) {
  //   try {
  //     const checkIfUserExists = await this.usersRepository.findOneBy({
  //       email: data.email,
  //     });
  //     if (checkIfUserExists) return false;

  //     const user = await this.usersRepository.save(data);
  //     console.log('User create: ', user);
  //     return user;
  //   } catch (error) {
  //     console.log('error creating user: ', error);
  //     return false;
  //   }
  // }
}
