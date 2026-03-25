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
import { CreateSubjectDto } from './dto/subject.dto';

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

  @Delete(':id')
  deleteSubject(@Param('id') id: string, @GetCurrentSchoolId() schoolId: string) {
    return this.subjectService.deleteSubject(id, schoolId);
  };

}