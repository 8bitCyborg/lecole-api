import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { SchoolService } from './school.service';
import { CreateSchoolDto, UpdateSchoolDto } from './dto/school.dto';
import { AtGuard } from '../auth/common/guards/at.guard';
import { GetCurrentUserId } from '../auth/common/decorators';

@UseGuards(AtGuard)
@Controller('school')
export class SchoolController {
  constructor(private schoolService: SchoolService) { }

  @Post()
  async create(
    @Body() dto: CreateSchoolDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { school, tokens } = await this.schoolService.create(dto);
    this.setCookies(res, tokens);
    return school;
  }

  private setCookies(res: Response, tokens: any) {
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  @Get()
  findMySchool(@GetCurrentUserId() userId: string) {
    return this.schoolService.findByUserId(userId);
  };

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSchoolDto) {
    return this.schoolService.update(id, dto);
  };
};
