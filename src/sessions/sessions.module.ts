import { Session, SessionSchema } from './schemas/session.schema';
import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { School, SchoolSchema } from 'src/schools/schemas/school.schema';
import { Term, TermSchema } from 'src/terms/schemas/term.schema';
import { Class, ClassSchema } from 'src/classes/schemas/classes.schema';
import {
  AssessmentRecord,
  AssessmentRecordSchema,
} from 'src/assessment-records/schemas/assessment-records.schema';
import { Subject, SubjectSchema } from 'src/subjects/schemas/subject.schema';
import { SchoolsService } from 'src/schools/schools.service';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Student, StudentSchema } from 'src/students/schemas/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Session.name, schema: SessionSchema },
      { name: School.name, schema: SchoolSchema },
      { name: Term.name, schema: TermSchema },
      { name: Class.name, schema: ClassSchema },
      { name: AssessmentRecord.name, schema: AssessmentRecordSchema },
      { name: Subject.name, schema: SubjectSchema },
      { name: User.name, schema: UserSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService, SchoolsService],
})
export class SessionsModule {}
