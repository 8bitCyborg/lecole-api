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
import { TeacherService } from './teacher.service';
import { CreateTeacherDto } from './dto/createTeacher.dto';
import { GetCurrentSchoolId } from '../auth/common/decorators';

@Controller('teacher')
export class TeacherController {
  constructor(private teacherService: TeacherService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTeacher(
    @Body() dto: CreateTeacherDto,
    @GetCurrentSchoolId() schoolId: string,
  ) {
    return this.teacherService.createTeacher(dto, schoolId);
  }

  @Get()
  getTeachers(@GetCurrentSchoolId() schoolId: string) {
    return this.teacherService.findBySchool(schoolId);
  }

  @Get(':id')
  getTeacher(@Param('id') id: string) {
    return this.teacherService.getTeacher(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  deleteTeacher(@Param('id') id: string) {
    return this.teacherService.deleteTeacher(id);
  }
}
