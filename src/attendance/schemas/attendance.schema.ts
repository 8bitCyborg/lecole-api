import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ClassArm } from '../../classes/schemas/class-arm.schema';
import { Class } from '../../classes/schemas/classes.schema';
import { School } from '../../schools/schemas/school.schema';
import { Session } from '../../sessions/schemas/session.schema';
import { Student } from '../../students/schemas/student.schema';
import { Term } from '../../terms/schemas/term.schema';

@Schema({ timestamps: true })
export class Attendance extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'School', required: true })
  schoolId: School;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Class',
    required: true,
  })
  classId: Class;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'ClassArm',
    required: true,
  })
  armId: ClassArm;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Session',
    required: true,
  })
  sessionId: Session;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Term', required: true })
  termId: Term;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Student',
    required: true,
  })
  studentId: Student;

  @Prop({ required: true })
  date: Date;

  @Prop({ type: Boolean, default: false })
  present: boolean;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
