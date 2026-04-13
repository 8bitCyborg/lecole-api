import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { SchoolModule } from 'src/school/school.module';

@Module({
  imports: [SchoolModule],
  providers: [AttendanceService],
  controllers: [AttendanceController]
})
export class AttendanceModule {}
