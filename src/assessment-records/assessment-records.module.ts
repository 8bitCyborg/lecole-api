import { Module } from '@nestjs/common';
import { AssessmentRecordsService } from './assessment-records.service';
import { AssessmentRecordsController } from './assessment-records.controller';
import {
  AssessmentRecord,
  AssessmentRecordSchema,
} from './schemas/assessment-records.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AssessmentRecord.name, schema: AssessmentRecordSchema },
    ]),
  ],
  controllers: [AssessmentRecordsController],
  providers: [AssessmentRecordsService],
})
export class AssessmentRecordsModule {}
