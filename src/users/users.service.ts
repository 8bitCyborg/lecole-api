import { Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { AuthUtilsService } from 'src/auth/authUtils/auth.utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    // private AuthUtilsService: AuthUtilsService,
  ) {} // private usersRepository: Repository<Users>, // @InjectRepository(Users)

  async findUser(login_id: string) {
    try {
      // const user = await this.userModel.findOne({ email: login_id });
      const user = await this.userModel.findOne({
          $or: [
          { email: login_id },
         { loginId: login_id  }
        ]
      });

      return user;
    } catch (error) {
      console.log('Error finding user: ', error);
      return false;
    }
  }

  async createUser(data: UserDto) {
    try {
      const checkIfUserExists = await this.userModel.findOne({
        email: data.email,
      });

      if (checkIfUserExists) return false;

      // const newId = new ObjectId();
      // const newUser = {
      //   ...data,
      //   _id: newId,
      //   loginId: newId.toString().slice(-5).toUpperCase(),
      // };
      const user = await this.userModel.create(data);
      return user;
    } catch (error) {
      console.log('Error creating user: ', error);
    }
  }
}
