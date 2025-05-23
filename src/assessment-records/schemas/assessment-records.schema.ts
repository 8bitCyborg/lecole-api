import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

export interface IAssessmentRecord extends Document {
  studentId: Types.ObjectId;
  schoolId: Types.ObjectId;
  classId: Types.ObjectId;
  sessionId: Types.ObjectId;
  termId: Types.ObjectId;
  subjectScores: {
    subjectId: Types.ObjectId;
    ca1?: number;
    ca2?: number;
    exam?: number;
    total?: number; // optional: can be auto-calculated
    grade?: string;
    remark?: string;
  }[];
}

// export const AssessmentRecordSchema = new Schema<IAssessmentRecord>(
//   {
//     studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
//     schoolId: { type: Schema.Types.ObjectId, ref: 'School', required: true },
//     classId: { type: Schema.Types.ObjectId, ref: 'Class' },
//     sessionId: { type: Schema.Types.ObjectId, ref: 'Session', required: true },
//     termId: { type: Schema.Types.ObjectId, ref: 'Term', required: true },
//     subjectScores: [
//       {
//         subjectId: {
//           type: Schema.Types.ObjectId,
//           ref: 'Subject',
//           required: true,
//         },
//         ca: { type: Number, default: 0 },
//         exam: { type: Number, default: 0 },
//         total: { type: Number },
//         grade: { type: String },
//         remark: { type: String },
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   },
// );

// export const AssessmentRecord = mongoose.model<IAssessmentRecord>(
//   'AssessmentRecord',
//   AssessmentRecordSchema,
// );

// AssessmentRecordSchema.pre('save', function (next) {
//   const record = this as any;

//   for (const score of record.subjectScores) {
//     const ca = score.ca || 0;
//     const exam = score.exam || 0;
//     score.total = ca + exam;
//   }

//   next();
// });

@Schema({ timestamps: true })
export class AssessmentRecord {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  })
  studentId: Types.ObjectId;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true })
  schoolId: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  classId: Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true,
  })
  sessionId: Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Term', required: true })
  termId: Types.ObjectId;

  @Prop([
    {
      subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
      },
      ca: { type: Number, default: 0 },
      exam: { type: Number, default: 0 },
      total: { type: Number },
      grade: { type: String },
      remark: { type: String },
    },
  ])
  subjectScores: {
    subjectId: Types.ObjectId;
    ca?: number;
    exam?: number;
    total?: number; // optional: can be auto-calculated
    grade?: string;
    remark?: string;
  }[];
}

export const AssessmentRecordSchema =
  SchemaFactory.createForClass(AssessmentRecord);
