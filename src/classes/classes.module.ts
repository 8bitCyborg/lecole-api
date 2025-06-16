import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { ClassesController } from './classes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Class, ClassSchema } from './schemas/classes.schema';
import {
  AssessmentRecord,
  AssessmentRecordSchema,
} from 'src/assessment-records/schemas/assessment-records.schema';
import { AssessmentRecordsService } from 'src/assessment-records/assessment-records.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Class.name, schema: ClassSchema },
      { name: AssessmentRecord.name, schema: AssessmentRecordSchema },
    ]),
  ],
  controllers: [ClassesController],
  providers: [ClassesService, AssessmentRecordsService],
})
export class ClassesModule {}
