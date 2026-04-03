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
import { ClassService } from './class.service';
import { AtGuard } from 'src/auth/common/guards/at.guard';
import { GetCurrentUserId, GetCurrentSchoolId } from 'src/auth/common/decorators';
import { CreateClassDto } from './dto/createClass.dto';
import { CreateArmDto } from './dto/createArm.dto';
import { AssignSubjectsDto } from './dto/assignSubjects.dto';

@UseGuards(AtGuard)
@Controller('class')
export class ClassController {
  constructor(private classService: ClassService) { }

  @Get()
  findAll(@GetCurrentSchoolId() schoolId: string) {
    return this.classService.findAll(schoolId);
  };

  @Post()
  create(@Body() dto: CreateClassDto) {
    return this.classService.createClass(dto);
  };

  @Delete(':id')
  deleteClass(
    @Param('id') id: string,
    @GetCurrentSchoolId() schoolId: string,
  ) {
    return this.classService.deleteClass(id, schoolId);
  }

  @Get('arms')
  findArmsBySchool(@GetCurrentSchoolId() schoolId: string) {
    return this.classService.getArmsBySchool(schoolId);
  }

  @Get(':id/arms')
  findArms(@Param('id') classId: string) {
    return this.classService.findArms(classId);
  }

  @Post(':id/arms')
  createArm(
    @Param('id') classId: string,
    @GetCurrentSchoolId() schoolId: string,
    @Body() dto: Omit<CreateArmDto, 'classId' | 'schoolId'>,
  ) {
    return this.classService.createArm({
      ...dto,
      classId,
      schoolId,
    });
  };

  @Delete(':id/arms/:armId')
  deleteArm(
    @Param('id') classId: string,
    @Param('armId') armId: string,
    @GetCurrentSchoolId() schoolId: string,
  ) {
    return this.classService.deleteArm(armId, classId, schoolId);
  };

  @Patch(':id/arms/:armId')
  updateArm(
    @Param('id') classId: string,
    @Param('armId') armId: string,
    @GetCurrentSchoolId() schoolId: string,
    @Body() dto: Partial<CreateArmDto>,
  ) {
    return this.classService.updateArm(armId, classId, schoolId, dto);
  };

  @Patch('arms/:armId/master')
  assignMasterToArm(
    @Param('armId') armId: string,
    @GetCurrentSchoolId() schoolId: string,
    @Body() dto: { staffId: string | null },
  ) {
    return this.classService.assignMasterToArm(armId, dto.staffId, schoolId);
  };

  @Post(':id/subjects')
  assignSubjects(
    @Param('id') classId: string,
    @GetCurrentSchoolId() schoolId: string,
    @Body() dto: AssignSubjectsDto,
  ) {
    return this.classService.assignSubjects(classId, schoolId, dto.subjectIds);
  };

};