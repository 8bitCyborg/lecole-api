import { Module } from '@nestjs/common';
import { GradingService } from './grading.service';
import { GradingController } from './grading.controller';
import { SchoolModule } from 'src/school/school.module';

@Module({
  imports: [SchoolModule],
  providers: [GradingService],
  controllers: [GradingController]
})
export class GradingModule {}
