import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Term extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Session', required: true })
  sessionId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'School', required: true })
  schoolId: Types.ObjectId;

  @Prop({ required: true })
  termIndex: number; // 1, 2 or 3

  @Prop({ required: true })
  name: string; // first, second or third

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({
    type: String,
    enum: [ 'inactive', 'active', 'ended'],
    default: 'inactive',
  })
  status: 'inactive' | 'active' | 'archived';
}

export const TermSchema = SchemaFactory.createForClass(Term);
