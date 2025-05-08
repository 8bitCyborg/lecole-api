import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
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

  @Get()
  findAll() {
    return this.sessionsService.findAll();
  }

  @Get(':sessionId')
  findOne(@Param('sessionId') sessionId: string) {
    return this.sessionsService.findOne(sessionId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    return this.sessionsService.update(+id, updateSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sessionsService.remove(+id);
  }
}
