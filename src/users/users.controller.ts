import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersSevice: UsersService) {}

  @Get(':email')
  findUser(@Param('email') email: string) {
    return this.usersSevice.findUser(email);
  }
}
