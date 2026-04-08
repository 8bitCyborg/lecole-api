import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { GradingService } from './grading.service';
import { AtGuard } from 'src/auth/common/guards/at.guard';
import { GetCurrentSchoolId } from 'src/auth/common/decorators';
import { CreateGradingModuleDto } from './dto/create-grading-module.dto';
import { UpdateGradingModuleDto } from './dto/update-grading-module.dto';
import { LockGradingModulesDto } from './dto/lock-grading-module.dto';

@UseGuards(AtGuard)
@Controller('grading')
export class GradingController {
  constructor(private gradingService: GradingService) { }

  @Post('modules')
  create(
    @GetCurrentSchoolId() schoolId: string,
    @Body() dto: CreateGradingModuleDto,
  ) {
    return this.gradingService.create({
      ...dto,
      schoolId,
    });
  }

  @Get('modules')
  findAll(
    @GetCurrentSchoolId() schoolId: string,
    @Query('session') session?: string,
    @Query('term') term?: string,
  ) {
    return this.gradingService.findAll(schoolId, session, term);
  }

  @Get('modules/:id')
  findOne(@Param('id') id: string) {
    return this.gradingService.findOne(id);
  }

  @Patch('modules/lock')
  toggleLock(
    @GetCurrentSchoolId() schoolId: string,
    @Body() dto: LockGradingModulesDto,
  ) {
    return this.gradingService.toggleLock(schoolId, dto.ids, dto.lock);
  }

  @Patch('modules/:id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateGradingModuleDto,
  ) {
    return this.gradingService.update(id, dto);
  }

  @Delete('modules/:id')
  remove(@Param('id') id: string) {
    return this.gradingService.remove(id);
  }
}
