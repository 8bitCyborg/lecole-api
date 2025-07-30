import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersSevice: UsersService) {}

  @Get(':email')
  findUser(@Param('email') email: string) {
    console.log('email: ', email);
    return this.usersSevice.findUser(email);
  }

  @Get('userId/:id')
  findUserById(@Param('id') id: string) {
    return this.usersSevice.getUserById(id);
  }

  @Patch('update/:id')
  updateUser(@Param('id') id: string, @Body() data: UserDto) {
    return this.usersSevice.updateUserById(id, data);
  }
}
