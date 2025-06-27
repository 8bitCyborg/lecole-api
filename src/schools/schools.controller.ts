import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { Public } from 'src/auth/authUtils/auth.guard';
import { GradingScheme } from './schemas/grading.schama';

@Controller('schools')
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Public()
  @Post()
  create(@Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolsService.createSchool(createSchoolDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.schoolsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schoolsService.findOne(id);
  }

  @Post('gradingScheme/:schoolId')
  updateGrade(@Param('schoolId') schoolId: string, @Body() gradeUpdate) {
    return this.schoolsService.updateGrade(schoolId, gradeUpdate);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto) {
    return this.schoolsService.update(+id, updateSchoolDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schoolsService.remove(+id);
  }

  @Post('/endTerm/:schoolId/:termId')
  endTerm(
    @Param('schoolId') schoolId: string,
    @Param('termId') termId: string,
  ) {
    return this.schoolsService.endTerm(schoolId, termId);
  }

  @Post('/beginTerm/:schoolId/:termId')
  beginTerm(
    @Param('schoolId') schoolId: string,
    @Param('termId') termId: string,
  ) {
    return this.schoolsService.beginTerm(schoolId, termId);
  }
}
