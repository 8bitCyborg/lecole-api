import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schemas/student.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { AssessmentRecord, AssessmentRecordSchema } from 'src/assessment-records/schemas/assessment-records.schema';
import { Class, ClassSchema } from 'src/classes/schemas/classes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: User.name, schema: UserSchema },
      { name: AssessmentRecord.name, schema: AssessmentRecordSchema },
      { name: Class.name, schema: ClassSchema },
    ]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
