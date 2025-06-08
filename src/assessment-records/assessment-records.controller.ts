import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AssessmentRecordsService } from './assessment-records.service';

@Controller('assessment')
export class AssessmentRecordsController {
  constructor(
    private readonly assessmentRecordsService: AssessmentRecordsService,
  ) {}

  // @Post()
  // create(@Body() createAssessmentRecordDto: CreateAssessmentRecordDto) {
  //   return this.assessmentRecordsService.create(createAssessmentRecordDto);
  // }

  // @Get('student/:studentId/:classId/:termId/:sessionId/:schoolId')
  // getStudentRecords(
  //   @Param('studentId') studentId: string,
  //   @Param('classId') classId: string,
  //   @Param('termId') termId: string,
  //   @Param('sessionId') sessionId: string,
  //   @Param('schoolId') schoolId: string,
  // ) {
  //   console.log(studentId, classId, termId, sessionId, schoolId);
  //   return this.assessmentRecordsService.getStudentRecords(
  //     studentId,
  //     classId,
  //     termId,
  //     sessionId,
  //     schoolId,
  //   );
  // }

  @Post('student/:studentId')
  getStudentRecords(
    @Body() recordDetails: any,
    // @Param('studentId') studentId: string,
  ) {
    return this.assessmentRecordsService.getStudentRecords(recordDetails);
  }

  // @Patch(':recordId')
  // updateRecord(@Param('recordId') recordId: string, @Body() record) {
  //   return 'hello';
  // }

  @Post('student/save/:recordId')
  updateRecord(
    @Param('recordId') recordId: string,
    @Body() subjectScores: { ca: number; exam: number }[],
  ) {
    console.log('Updating record with ID:', recordId, subjectScores);
    return this.assessmentRecordsService.updateRecord(recordId, subjectScores);
  }

  @Get('subject/:termId/:subjectId/:classId')
  getSubjectRecords(@Param() termId, @Param() subjectId, @Param() classId) {
    console.log('SubjectId: ', subjectId.subjectId);
    console.log('TermId: ', termId.termId);
    return this.assessmentRecordsService.getRecordsBySubjects(
      termId.termId,
      subjectId.subjectId,
      classId.classId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assessmentRecordsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assessmentRecordsService.remove(+id);
  }
}
