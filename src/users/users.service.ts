import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/register.dto';
import { UserDto } from './dto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { AuthUtilsService } from '../auth/authUtils/auth.utils';

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
        $or: [{ email: login_id }, { loginId: login_id }],
      });

      return user?.toObject();
    } catch (error) {
      console.log('Error finding user: ', error);
      return false;
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.userModel.findById(id);
      return user?.toObject();
    } catch (error) {
      console.log('Error getting user by ID: ', error);
      return false;
    }
  }

  async updateUser(data: UserDto) {
    try {
      const user = await this.userModel.updateOne({ _id: data._id }, data);
      return user;
    } catch (error) {
      console.log('Error updating user: ', error);
    }
  }

  async updateUserById(id: string, data: UserDto) {
    try {
      const user = await this.userModel.findByIdAndUpdate(data);
      return user?.toObject();
    } catch (error) {
      console.log('Error updating user by ID: ', error);
      throw new Error('User not found');
    }
  }

  async createUser(data: UserDto) {
    try {
      const checkIfUserExists = await this.userModel.findOne({
        email: data.email,
      });
      if (checkIfUserExists) return false;

      const user = await this.userModel.create(data);
      const { password, ...userDetails } = user.toObject();
      return userDetails;
    } catch (error) {
      console.log('Error creating user: ', error);
      return false;
    }
  }
}
