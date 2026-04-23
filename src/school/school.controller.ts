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
import { CreateAcademicSessionDto, UpdateAcademicSessionDto } from './dto/academicSession.dto';
import { CreateTermDto, UpdateTermDto } from './dto/term.dto';

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
      secure: true, //process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: true, //process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
  };

  @Get()
  findMySchool(@GetCurrentUserId() userId: string) {
    return this.schoolService.findByUserId(userId);
  };

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSchoolDto) {
    return this.schoolService.update(id, dto);
  }

  @Post('session')
  createSession(@GetCurrentSchoolId() schoolId: string, @Body() dto: CreateAcademicSessionDto) {
    if (!schoolId) throw new ForbiddenException('School ID is required');
    return this.schoolService.createSession(schoolId, dto);
  }

  @Patch('session/:sessionId')
  updateSession(
    @GetCurrentSchoolId() schoolId: string,
    @Param('sessionId') sessionId: string,
    @Body() dto: UpdateAcademicSessionDto
  ) {
    if (!schoolId) throw new ForbiddenException('School ID is required');
    return this.schoolService.updateSession(schoolId, sessionId, dto);
  }

  @Patch('session/:sessionId/end')
  endSession(
    @GetCurrentSchoolId() schoolId: string,
    @Param('sessionId') sessionId: string
  ) {
    if (!schoolId) throw new ForbiddenException('School ID is required');
    return this.schoolService.endSession(schoolId, sessionId);
  }

  @Get('session')
  getSessions(@GetCurrentSchoolId() schoolId: string) {
    if (!schoolId) throw new ForbiddenException('School ID is required');
    return this.schoolService.getSessions(schoolId);
  }
  @Get('session/current')
  getCurrentSession(@GetCurrentSchoolId() schoolId: string) {
    if (!schoolId) throw new ForbiddenException('School ID is required');
    return this.schoolService.getCurrentSession(schoolId);
  }

  @Post('term')
  createTerm(@GetCurrentSchoolId() schoolId: string, @Body() dto: CreateTermDto) {
    if (!schoolId) throw new ForbiddenException('School ID is required');
    return this.schoolService.createTerm(schoolId, dto);
  }

  @Patch('term/:termId')
  updateTerm(
    @GetCurrentSchoolId() schoolId: string,
    @Param('termId') termId: string,
    @Body() dto: UpdateTermDto
  ) {
    if (!schoolId) throw new ForbiddenException('School ID is required');
    return this.schoolService.updateTerm(schoolId, termId, dto);
  }

  @Patch('term/:termId/end')
  endTerm(
    @GetCurrentSchoolId() schoolId: string,
    @Param('termId') termId: string
  ) {
    if (!schoolId) throw new ForbiddenException('School ID is required');
    return this.schoolService.endTerm(schoolId, termId);
  }
};

