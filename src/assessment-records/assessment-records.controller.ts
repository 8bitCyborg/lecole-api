import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AssessmentRecordsService } from './assessment-records.service';
import { AssessmentRecord } from './schemas/assessment-records.schema';
import { AssessmentRecordType } from 'types';

@Controller('assessment')
export class AssessmentRecordsController {
  constructor(
    private readonly assessmentRecordsService: AssessmentRecordsService,
  ) {}

  @Post('student/:studentId')
  getStudentRecords(@Body() recordDetails: any) {
    return this.assessmentRecordsService.getStudentRecords(recordDetails);
  }

  @Post('student/save/:recordId')
  updateRecord(
    @Param('recordId') recordId: string,
    @Body() subjectScores: { ca: number; exam: number }[],
  ) {
    return this.assessmentRecordsService.updateRecord(recordId, subjectScores);
  }

  @Post('bulk/save')
  buikUpdate(@Body() records: AssessmentRecordType[]) {
    return this.assessmentRecordsService.bulkSave(records);
  }

  @Get('subject/:termId/:subjectId/:classId')
  getSubjectRecords(@Param() termId, @Param() subjectId, @Param() classId) {
    return this.assessmentRecordsService.getRecordsBySubjects(
      termId.termId,
      subjectId.subjectId,
      classId.classId,
    );
  }

  @Get('/all/:schoolId')
  getAll(@Param() schoolId) {
    return this.assessmentRecordsService.getAllRecords(schoolId.schoolId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assessmentRecordsService.findOne(+id);
  }

  @Get('/unique/:studentId/:termId')
  findRecord(
    @Param('studentId') studentId: string,
    @Param('termId') termId: string,
  ) {
    return this.assessmentRecordsService.findByStudentIdTermId(
      studentId,
      termId,
    );
  }

  @Get('/recordId/:recordId')
  findByRecordId(@Param('recordId') recordId: string) {
    return this.assessmentRecordsService.findByRecordId(recordId);
  }
}
