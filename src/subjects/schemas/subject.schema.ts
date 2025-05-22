import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Subject extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  code: string;

  // @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }] })
  // classId: mongoose.Schema.Types.ObjectId[];

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Staff' })
  // teacherId: mongoose.Schema.Types.ObjectId;

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true })
  schoolId: string;

  @Prop({
    type: [
      {
        teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
      },
    ],
  })
  assignments: { teacherId: string; classId: string }[];

  @Prop({ default: 100 })
  maxScore: number;

  // @Prop({
  //   type: {
  //     exam: { type: Number, default: 70 },
  //     ca1: { type: Number, default: 10 },
  //     ca2: { type: Number, default: 10 },
  //     ca3: { type: Number, default: 10 },
  //   },
  // })
  // scoreDistribution: {
  //   exam: number;
  //   ca1: number;
  //   ca2: number;
  //   ca3: number;
  // };
}

export const SubjectSchema = SchemaFactory.createForClass(Subject);

// Add a pre-save middleware to validate score distribution
// SubjectSchema.pre('save', function (next) {
//   const total =
//     this.scoreDistribution.exam +
//     this.scoreDistribution.ca1 +
//     this.scoreDistribution.ca2 +
//     this.scoreDistribution.ca3;

//   if (total !== 100) {
//     throw new Error('Score distribution must total 100');
//   }
//   next();
// });
