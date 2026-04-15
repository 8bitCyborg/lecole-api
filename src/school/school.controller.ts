import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,

  UseGuards,
  ForbiddenException,
} from '@nestjs/common';

import type { Response } from 'express';
import { SchoolService } from './school.service';
import { CreateSchoolDto, UpdateSchoolDto } from './dto/school.dto';
import { CreateAcademicSessionDto } from './dto/academicSession.dto';
import { CreateTermDto } from './dto/term.dto';

import { AtGuard } from '../auth/common/guards/at.guard';
import { GetCurrentUserId, GetCurrentSchoolId } from '../auth/common/decorators';


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

  // needed here because the schoolId has to be baked into the jwt for zero-trust.
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
  };

  @Get()
  findMySchool(@GetCurrentUserId() userId: string) {
    return this.schoolService.findByUserId(userId);
  };

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSchoolDto) {
    return this.schoolService.update(id, dto);
  };

  @Post('sessions')
  createSession(
    @GetCurrentSchoolId() schoolId: string,
    @Body() dto: CreateAcademicSessionDto,
  ) {
    if (!schoolId) throw new ForbiddenException('School ID not found in token');
    return this.schoolService.createSession(schoolId, dto);
  }

  @Get('sessions')
  findAllSessions(@GetCurrentSchoolId() schoolId: string) {
    if (!schoolId) throw new ForbiddenException('School ID not found in token');
    return this.schoolService.findAllSessions(schoolId);
  }

  @Get('sessions/:id')
  findSessionById(@Param('id') id: string) {
    return this.schoolService.findSessionById(id);
  }

  @Post('terms')
  createTerm(
    @GetCurrentSchoolId() schoolId: string,
    @Body() dto: CreateTermDto,
  ) {
    if (!schoolId) throw new ForbiddenException('School ID not found in token');
    return this.schoolService.createTerm(schoolId, dto);
  }

  @Get('terms')
  findAllTerms(
    @GetCurrentSchoolId() schoolId: string,
    @Query('sessionId') sessionId?: string,
  ) {
    if (!schoolId) throw new ForbiddenException('School ID not found in token');
    return this.schoolService.findAllTerms(schoolId, sessionId);
  }
};

