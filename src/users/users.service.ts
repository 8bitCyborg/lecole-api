import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findUser(login_id: string) {
    try {
      const user = await this.usersRepository.find({
        where: {
          // @ts-ignore
          $or: [{ username: login_id }, { email: login_id }],
        },
      });
      if (user.length > 0) return user[0];
      return false;
    } catch (error) {
      console.log('error finding user: ', error);
      return false;
    }
  }

  async createUser(data: UserDto) {
    try {
      const checkIfUserExists = await this.usersRepository.findOneBy({
        email: data.email,
      });
      if (checkIfUserExists) return false;

      const user = await this.usersRepository.save(data);
      console.log('User create: ', user);
      return user;
    } catch (error) {
      console.log('error creating user: ', error);
      return false;
    }
  }
}
