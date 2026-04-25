import { Controller, Get, UseGuards, ForbiddenException } from '@nestjs/common';
import { UserService } from './user.service';
import { AtGuard } from '../auth/common/guards/at.guard';
import { GetCurrentUserId, GetCurrentSchoolId } from '../auth/common/decorators';

@UseGuards(AtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Get('profile')
  async getProfile(
    @GetCurrentUserId() userId: string,
    @GetCurrentSchoolId() schoolId: string,
  ) {
    if (!schoolId) throw new ForbiddenException('School ID is required');
    return this.userService.getUserProfile(userId, schoolId);
  }
}
