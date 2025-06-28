import { Module } from '@nestjs/common';
import { TermsService } from './terms.service';
import { TermsController } from './terms.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Term, TermSchema } from './schemas/term.schema';
import { AssessmentRecord, AssessmentRecordSchema } from 'src/assessment-records/schemas/assessment-records.schema';
import { Class, ClassSchema } from 'src/classes/schemas/classes.schema';
import { Subject, SubjectSchema } from 'src/subjects/schemas/subject.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Term.name, schema: TermSchema },
      { name: AssessmentRecord.name, schema: AssessmentRecordSchema },
      { name: Class.name, schema: ClassSchema },
      { name: Subject.name, schema: SubjectSchema },
    ]),
  ],
  controllers: [TermsController],
  providers: [TermsService],
})
export class TermsModule {}
