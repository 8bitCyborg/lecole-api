import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto, UpdateSchoolDto } from './dto/school.dto';
import { AtGuard } from '../auth/common/guards/at.guard';
import { GetCurrentUserId } from '../auth/common/decorators';

@UseGuards(AtGuard)
@Controller('school')
export class SchoolController {
  constructor(private schoolService: SchoolService) { }

  @Post()
  create(@Body() dto: CreateSchoolDto) {
    return this.schoolService.create(dto);
  };

  @Get()
  findMySchool(@GetCurrentUserId() userId: string) {
    return this.schoolService.findByUserId(userId);
  };

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSchoolDto) {
    return this.schoolService.update(id, dto);
  };
}
