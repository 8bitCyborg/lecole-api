import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AtGuard } from 'src/auth/common/guards/at.guard';
import { GetCurrentSchoolId, GetCurrentUserId } from 'src/auth/common/decorators';
import { BatchUpsertAttendanceDto } from './dto/batch-upsert-attendance.dto';

@UseGuards(AtGuard)
@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) { }

  @Post('batch-upsert')
  markAttendance(
    @GetCurrentSchoolId() schoolId: string,
    @GetCurrentUserId() userId: string,
    @Body() dto: BatchUpsertAttendanceDto,
  ) {
    return this.attendanceService.markAttendance(schoolId, userId, dto);
  }

  @Get()
  findAttendanceRecords(
    @GetCurrentSchoolId() schoolId: string,
    @Query('classId') classId: string,
    @Query('armId') armId: string,
    @Query('term') term: string,
    @Query('session') session: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.findAttendanceRecords(
      schoolId,
      classId,
      armId,
      term,
      session,
      startDate,
      endDate
    );
  }

  @Get('student/:studentId')
  findStudentRecords(@Param('studentId') studentId: string) {
    return this.attendanceService.findStudentRecords(studentId);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.attendanceService.remove(id);
  // }
}
