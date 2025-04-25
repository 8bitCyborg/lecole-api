import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentDto } from './entity/student.dto';

@Controller('students')
export class StudentsController {
  constructor(private studentService: StudentsService) {}

  //   @Post(@Params() id )
  //   addStudent() {
  //     return this.studentService.addStudent();
  //   }

  @Get(':id')
  getAllStudents(@Param('id') schoolId: string) {
    return this.studentService.getAllStudents(schoolId);
  }

  @Post(':id')
  addStudent(@Param('id') schoolId: string, @Body() student: StudentDto) {
    console.log('Add student: ', student);
    return this.studentService.addStudent(student);
  }
}
