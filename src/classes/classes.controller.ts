import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClassesService } from './classes.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Controller('class')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post()
  create(@Body() createClassDto: CreateClassDto) {
    // return this.classesService.create(createClassDto);
    return createClassDto;
  }

  @Get(':schoolId')
  findAll(@Param('schoolId') schoolId: string) {
    return this.classesService.findAll(schoolId);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.classesService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classesService.update(+id, updateClassDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classesService.remove(+id);
  }
}
