import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { SaveAttendanceDto } from './schemas/save-attendance.schema';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('save/:schoolId')
  saveClassAttendance(@Body() saveAttendanceDto: SaveAttendanceDto) {
    return this.attendanceService.saveClassAttendance(saveAttendanceDto);
  }

  @Get('class/:classId/:termId/:date')
  findAll(
    @Param('classId') classId: string,
    @Param('termId') termId: string,
    @Param('date') date: string,
  ) {
    return this.attendanceService.findAll(classId, termId, date);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.attendanceService.findOne(+id);
  // }
}
