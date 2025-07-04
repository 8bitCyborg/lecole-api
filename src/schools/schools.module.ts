import { Module } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { SchoolsController } from './schools.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { School } from './entities/school.entity';
import { SchoolSchema } from './schemas/school.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { Class, ClassSchema } from 'src/classes/schemas/classes.schema';
import { Term, TermSchema } from 'src/terms/schemas/term.schema';
import {
  AssessmentRecord,
  AssessmentRecordSchema,
} from 'src/assessment-records/schemas/assessment-records.schema';
import { Subject, SubjectSchema } from 'src/subjects/schemas/subject.schema';
import { Student, StudentSchema } from 'src/students/schemas/student.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: School.name, schema: SchoolSchema },
      { name: User.name, schema: UserSchema },
      { name: Class.name, schema: ClassSchema },
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
