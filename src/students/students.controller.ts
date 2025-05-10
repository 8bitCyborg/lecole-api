import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentDto } from './entity/student.dto';

@Controller('students')
export class StudentsController {
  constructor(private studentService: StudentsService) {}

  @Get(':schoolId')
  getAllStudents(@Param('schoolId') schoolId: string) {
    console.log('Schoolid:', schoolId);
    return this.studentService.getAllStudents(schoolId);
  }

  @Post(':id')
  addStudent(@Param('id') schoolId: string, @Body() studentData: StudentDto) {
    console.log('Add student: ', studentData);
    return this.studentService.addStudent(schoolId, studentData);
  }
}
