import { Module } from '@nestjs/common';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { ArmService } from './arm.service';

@Module({
  controllers: [ClassController],
  providers: [ClassService, ArmService]
})
export class ClassModule {}
