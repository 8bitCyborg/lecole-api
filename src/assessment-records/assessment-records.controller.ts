import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AssessmentRecordsService } from './assessment-records.service';
import { CreateAssessmentRecordDto } from './dto/create-assessment-record.dto';
import { UpdateAssessmentRecordDto } from './dto/update-assessment-record.dto';

@Controller('assessment')
export class AssessmentRecordsController {
  constructor(
    private readonly assessmentRecordsService: AssessmentRecordsService,
  ) {}

  @Post()
  create(@Body() createAssessmentRecordDto: CreateAssessmentRecordDto) {
    return this.assessmentRecordsService.create(createAssessmentRecordDto);
  }

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
  getStudentRecordsA(
    @Body() recordDetails,
    @Param('studentId') studentId: string,
  ) {
    return this.assessmentRecordsService.getStudentRecords(recordDetails);
  }

  @Patch(':recordId')
  updateRecord(@Param('recordId') recordId: string, @Body() record) {
    return 'hello';
  }

  @Post(':studentId')
  createRecord(
    @Param('studentId') studentId: string,
    @Body() record: { classId: string; termId: string; sessionId: string },
  ) {
    return 'hello';
  }

  @Get()
  findAll() {
    return this.assessmentRecordsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assessmentRecordsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAssessmentRecordDto: UpdateAssessmentRecordDto,
  ) {
    return this.assessmentRecordsService.update(+id, updateAssessmentRecordDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assessmentRecordsService.remove(+id);
  }
}
