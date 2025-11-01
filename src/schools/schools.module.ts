import { Module } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { SchoolsController } from './schools.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { School } from './entities/school.entity';
import { SchoolSchema } from './schemas/school.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Class, ClassSchema } from '../classes/schemas/classes.schema';
import { Term, TermSchema } from '../terms/schemas/term.schema';
import {
  AssessmentRecord,
  AssessmentRecordSchema,
} from '../assessment-records/schemas/assessment-records.schema';
import { Subject, SubjectSchema } from '../subjects/schemas/subject.schema';
import { Student, StudentSchema } from '../students/schemas/student.schema';
import { ClassArm, ClassArmSchema } from '../classes/schemas/class-arm.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: School.name, schema: SchoolSchema },
      { name: User.name, schema: UserSchema },
      { name: Class.name, schema: ClassSchema },
      { name: ClassArm.name, schema: ClassArmSchema },
      { name: Term.name, schema: TermSchema },
      { name: AssessmentRecord.name, schema: AssessmentRecordSchema },
      { name: Subject.name, schema: SubjectSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  controllers: [SchoolsController],
  providers: [SchoolsService],
})
export class SchoolsModule {}
