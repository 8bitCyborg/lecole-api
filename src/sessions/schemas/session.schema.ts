import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { School } from '../../schools/schemas/school.schema';

@Schema({ timestamps: true })
export class Session extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'School', required: true })
  schoolId: Types.ObjectId;
  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'School', required: true })
  // schoolId: Types.ObjectId;

  // @Prop()
  // schoolId: string;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Term' })
  termsId: MongooseSchema.Types.ObjectId[];

  @Prop({ default: '2020' })
  year: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
