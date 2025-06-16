import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post(':schoolId')
  create(
    @Body() createSubjectDto: CreateSubjectDto,
    @Param('schoolId') schoolId: string,
  ) {
    return this.subjectsService.create(schoolId, createSubjectDto);
  }

  @Post('bulk/:schoolId')
  bulkEntry(
    @Body() createSubjectDto: CreateSubjectDto[],
    @Param('schoolId') schoolId: string,
  ) {
    console.log('Subjects', createSubjectDto);
    return this.subjectsService.bulkCreate(schoolId, createSubjectDto);
  }

  @Get(`all/:schoolId`)
  findAll(@Param('schoolId') schoolId: string) {
    return this.subjectsService.findAll(schoolId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subjectsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto) {
    return this.subjectsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subjectsService.remove(id);
  }
}
