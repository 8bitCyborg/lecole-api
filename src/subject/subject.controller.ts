import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SubjectService } from './subject.service';
import { AtGuard } from 'src/auth/common/guards/at.guard';
import { GetCurrentUserId, GetCurrentSchoolId } from 'src/auth/common/decorators';
import { CreateSubjectDto, CreateBulkSubjectsDto } from './dto/subject.dto';

@UseGuards(AtGuard)
@Controller('subject')
export class SubjectController {
  constructor(private subjectService: SubjectService) { }

  @Get()
  findAll(@GetCurrentSchoolId() schoolId: string) {
    return this.subjectService.findAll(schoolId);
  };

  @Post()
  createSubject(@Body() dto: CreateSubjectDto) {
    return this.subjectService.createSubject(dto);
  };

  @Post('bulk')
  createBulkSubjects(@Body() dto: CreateBulkSubjectsDto) {
    return this.subjectService.createBulkSubjects(dto);
  };

  @Get(':id')
  findOne(@Param('id') id: string, @GetCurrentSchoolId() schoolId: string) {
    return this.subjectService.findOne(id, schoolId);
  };

  @Patch(':id/classes')
  assignClasses(
    @Param('id') id: string,
    @GetCurrentSchoolId() schoolId: string,
    @Body('classIds') classIds: string[]
  ) {
    return this.subjectService.assignClasses(id, schoolId, classIds);
  };

  @Patch(':id/teachers')
  assignTeachers(
    @Param('id') id: string,
    @GetCurrentSchoolId() schoolId: string,
    @Body('teacherIds') teacherIds: string[]
  ) {
    return this.subjectService.assignTeachers(id, schoolId, teacherIds);
  };

  @Delete(':id')
  deleteSubject(@Param('id') id: string, @GetCurrentSchoolId() schoolId: string) {
    return this.subjectService.deleteSubject(id, schoolId);
  };

}