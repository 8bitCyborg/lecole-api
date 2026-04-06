import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { GetCurrentSchoolId } from '../auth/common/decorators';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createStudent(
    @Body() dto: CreateStudentDto,
    @GetCurrentSchoolId() schoolId: string,
  ) {
    return this.studentService.createStudent(dto, schoolId);
  }

  @Get()
  getStudents(
    @GetCurrentSchoolId() schoolId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.studentService.findBySchool(
      schoolId, 
      Number(page) || 1, 
      Number(limit) || 10,
    );
  }

  @Get('archived')
  getArchivedStudents(
    @GetCurrentSchoolId() schoolId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.studentService.findArchivedBySchool(
      schoolId, 
      Number(page) || 1, 
      Number(limit) || 10,
    );
  }

  @Get('graduated')
  getGraduatedStudents(
    @GetCurrentSchoolId() schoolId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.studentService.findGraduatedBySchool(
      schoolId, 
      Number(page) || 1, 
      Number(limit) || 10,
    );
  }

  @Get(':id')
  getStudent(@Param('id') id: string) {
    return this.studentService.getStudent(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  updateStudent(@Param('id') id: string, @Body() dto: Partial<CreateStudentDto>) {
    return this.studentService.updateStudent(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  withdrawStudent(@Param('id') id: string) {
    return this.studentService.withdrawStudent(id);
  }
}
