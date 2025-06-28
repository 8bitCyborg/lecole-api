import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { UpdateSessionDto } from './dto/update-session.dto';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post(':schoolId')
  create(
    @Param('schoolId') schoolId,
    @Body() createSessionData: { year: string },
  ) {
    return this.sessionsService.createSession(schoolId, createSessionData);
  }

  @Get(`:schoolId`)
  findAll(@Param('schoolId') schoolId: string) {
    return this.sessionsService.findAll(schoolId);
  }

  @Get(':sessionId')
  findOne(@Param('sessionId') sessionId: string) {
    return this.sessionsService.findOne(sessionId);
  }

  @Post('end/:schoolId')
  endSession(@Param('schoolId') schoolId: string) {
    return this.sessionsService.endSession(schoolId);
  }
}
