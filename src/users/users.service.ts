import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

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
          $or: [
            { username: login_id },
            { email: login_id }
          ]
        }
      });
      if (user.length > 0) return user[0];
      return false;
    } catch (error) {
      return false;
    };
  };

  async createUser(data: any) {
    try {
      const checkIfUserExists = await this.usersRepository.findOneBy({email: data.email});
      if (Boolean(checkIfUserExists)){
        return false;
      };

      const user = await this.usersRepository.save(data);
      return user;
    } catch (error) {
      return false;
    };
  };

};