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
  @Get('/class/:classId')
  getClassStudents(@Param('classId') classId: string) {
    return this.studentService.getStudentsByClassId(classId);
  }

  @Post(':id')
  async addStudent(
    @Param('id') schoolId: string,
    @Body() studentData: StudentDto,
  ) {
    return this.studentService.addStudent(schoolId, studentData);
  }

  @Post('/bulk/:id')
  async bulkEntry(
    @Param('id') schoolId: string,
    @Body() studentData: StudentDto[],
  ) {
    return this.studentService.bulkEntry(schoolId, studentData);
  }

  @Post("promote/all/:schoolId")
  async promoteAll(
    @Param('schoolId') schoolId: string,
 
  ) {
    return this.studentService.promoteAll(schoolId);
  }
}
