import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { ClassArm } from './class-arm.schema';

@Schema({ timestamps: true })
export class Class {
  @Prop({ required: true })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'School', required: true })
  schoolId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Staff', required: false })
  classTeacher?: MongooseSchema.Types.ObjectId;

  @Prop()
  description: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Subject' }] })
  subjects: MongooseSchema.Types.ObjectId[];

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

  @Prop({ default: 'A' })
  subClass: string;

  @Prop()
  order: number;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'ClassArm' }] })
  classArms: ClassArm[];

  // @Prop()
  // arm: string;

  @Prop()
  alt: string;
}

export const ClassSchema = SchemaFactory.createForClass(Class);

// ClassSchema.virtual('students', {
//   ref: 'Student',
//   localField: '_id',
//   foreignField: 'class',
// });
// ClassSchema.set('toObject', { virtuals: true });
// ClassSchema.set('toJSON', { virtuals: true });

// const classWithStudents =
//   await ClassModel.findById(classId).populate('students');
