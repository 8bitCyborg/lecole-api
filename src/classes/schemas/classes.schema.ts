import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { model, Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Class {
  @Prop({ required: true })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'School', required: true })
  schoolId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Staff' })
  classTeacher: MongooseSchema.Types.ObjectId;

  @Prop()
  descroption: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Subject' }] })
  subjects: MongooseSchema.Types.ObjectId[];

  @Prop({default: "A"})
  subClass: string;
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
