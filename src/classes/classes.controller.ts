import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
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
  @Post('update/:classId/:termId')
  updateClass(
    @Param('classId') classId: string,
    @Param('termId') termId: string,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    return this.classesService.update(classId, termId, updateClassDto);
  }

  @Post('create/arm/:classId')
  createArm(
    @Param('classId') classId: string,
    @Body() createArm: { name: string; alt?: string; classId: string },
  ) {
    return this.classesService.createArm(classId, createArm);
  }

  @Post('update/arm/:armId/:termId')
  updateArm(
    @Param('armId') armId: string,
    @Param('termId') termId: string,
    @Body() updateClassDto: UpdateClassDto,
  ) {
    return this.classesService.updateArm(armId, termId, updateClassDto);
  }

  @Get('details/:classId')
  findOne(@Param('classId') classId: string) {
    return this.classesService.findClass(classId);
  }

  @Get('details/arm/:armId')
  finClassArm(@Param('armId') armId: string) {
    return this.classesService.findClassArm(armId);
  }
}
