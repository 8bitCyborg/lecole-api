import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { AtGuard } from 'src/auth/common/guards/at.guard';
import { GetCurrentUserId, GetCurrentSchoolId } from 'src/auth/common/decorators';
import { CreateClassDto } from './dto/createClass.dto';
import { CreateArmDto } from './dto/createArm.dto';

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
    return this.classService.create(dto);
  };

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
  }

}

