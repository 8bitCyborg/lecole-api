import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

// Arm subdocument schema
@Schema({ _id: true })
export class ClassArm {
  @Prop({ required: true })
  name: string; // "A", "B", "C", etc.

  @Prop()
  alt: string; // "A", "B", "C", etc.

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Staff' })
  classTeacher?: MongooseSchema.Types.ObjectId;

  @Prop({ default: 0 })
  maxStudents: number;

  @Prop({ default: 0 })
  currentStudents: number;

  @Prop()
  description?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop([
    {
      subjectId: {
        type: MongooseSchema.Types.ObjectId,
        ref: 'Subject',
        required: true,
      },
      teacherId: {
        type: MongooseSchema.Types.ObjectId,
        ref: 'Staff',
        default: null,
      },
    },
  ])
  subjectGroups: {
    subjectId: MongooseSchema.Types.ObjectId;
    teacherId?: MongooseSchema.Types.ObjectId;
  }[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Class' })
  classId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'School', required: true })
  schoolId: MongooseSchema.Types.ObjectId;
}

export const ClassArmSchema = SchemaFactory.createForClass(ClassArm);
