import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
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

  @Get(':id')
  getStaffMember(@Param('id') id: string) {
    return this.staffService.getStaff(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  updateStaffMember(@Param('id') id: string, @Body() dto: CreateStaffDto) {
    return this.staffService.updateStaff(id, dto);
  }

  @Patch(':id/subjects')
  @HttpCode(HttpStatus.OK)
  assignSubjects(
    @Param('id') id: string,
    @Body('subjectIds') subjectIds: string[],
  ) {
    return this.staffService.assignSubjects(id, subjectIds);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteStaffMember(@Param('id') id: string) {
    return this.staffService.deleteStaff(id);
  }
}
