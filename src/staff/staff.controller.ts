import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post(':id')
  create(@Param('id') schoolId: string, @Body() createStaffDto) {
    console.log('staff request :', schoolId, createStaffDto);
    return this.staffService.create(schoolId, createStaffDto);
  }

  // @Get(':schoolId')
  // findAll() {
  //   return this.staffService.findAll();
  // }

  @Get(':schoolId')
  findAll(@Param('schoolId') schoolId: string) {
    return this.staffService.getAllStaff(schoolId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffService.update(+id, updateStaffDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffService.remove(+id);
  }
}
