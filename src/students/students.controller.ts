import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentDto } from './entity/student.dto';

@Controller('students')
export class StudentsController {
  constructor(private studentService: StudentsService) {}

  @Get(':schoolId')
  getAllStudents(@Param('schoolId') schoolId: string) {
    return this.studentService.getAllStudents(schoolId);
  }

  @Get('/student/:studentId')
  getStudent(@Param('studentId') studentId: string) {
    return this.studentService.getStudent(studentId);
  }

  @Post(':id')
  async addStudent(
    @Param('id') schoolId: string,
    @Body() studentData: StudentDto,
  ) {
    return this.studentService.addStudent(schoolId, studentData);
  }
}
