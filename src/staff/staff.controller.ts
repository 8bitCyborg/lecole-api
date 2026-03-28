import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/createStaff.dto';
import { GetCurrentSchoolId } from '../auth/common/decorators';

@Controller('staff')
export class StaffController {
  constructor(private staffService: StaffService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createStaff(
    @Body() dto: CreateStaffDto,
    @GetCurrentSchoolId() schoolId: string,
  ) {
    return this.staffService.createStaff(dto, schoolId);
  }

  @Get()
  getStaffEntries(@GetCurrentSchoolId() schoolId: string) {
    return this.staffService.findBySchool(schoolId);
  }

  @Get('teachers')
  getTeachingStaff(@GetCurrentSchoolId() schoolId: string) {
    return this.staffService.findTeachingStaff(schoolId);
  }

  @Get(':id')
  getStaffMember(@Param('id') id: string) {
    return this.staffService.getStaff(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteStaffMember(@Param('id') id: string) {
    return this.staffService.deleteStaff(id);
  }
}
