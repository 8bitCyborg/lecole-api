import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { StaffService } from './staff.service';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post(':id')
  create(@Param('id') schoolId: string, @Body() createStaffDto) {
    console.log('staff request :', schoolId, createStaffDto);
    return this.staffService.create(schoolId, createStaffDto);
  }

  @Get(':schoolId')
  findAll(@Param('schoolId') schoolId: string) {
    return this.staffService.getAllStaff(schoolId);
  }

  @Get('one/:staffId')
  findStaff(@Param('staffId') staffId: string) {
    return this.staffService.findOne(staffId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(+id);
  }
}
