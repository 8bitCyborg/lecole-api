import { Session, SessionSchema } from './schemas/session.schema';
import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { School, SchoolSchema } from '../schools/schemas/school.schema';
import { Term, TermSchema } from '../terms/schemas/term.schema';
import { Class, ClassSchema } from '../classes/schemas/classes.schema';
import {
  AssessmentRecord,
  AssessmentRecordSchema,
} from '../assessment-records/schemas/assessment-records.schema';
import { Subject, SubjectSchema } from '../subjects/schemas/subject.schema';
import { SchoolsService } from '../schools/schools.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Student, StudentSchema } from '../students/schemas/student.schema';
import { ClassArm, ClassArmSchema } from '../classes/schemas/class-arm.schema';

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
      { name: ClassArm.name, schema: ClassArmSchema },
    ]),
  ],
  controllers: [SessionsController],
  providers: [SessionsService, SchoolsService],
})
export class SessionsModule {}
