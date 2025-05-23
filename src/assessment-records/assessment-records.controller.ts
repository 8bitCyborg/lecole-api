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

@Controller('assessment-records')
export class AssessmentRecordsController {
  constructor(
    private readonly assessmentRecordsService: AssessmentRecordsService,
  ) {}

  @Post()
  create(@Body() createAssessmentRecordDto: CreateAssessmentRecordDto) {
    return this.assessmentRecordsService.create(createAssessmentRecordDto);
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
