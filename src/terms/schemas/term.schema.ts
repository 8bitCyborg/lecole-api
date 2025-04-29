import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Term extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Session', required: true })
  sessionId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string; // e.g., "First Term"

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({
    type: String,
    enum: ['active', 'archived'],
    default: 'active',
  })
  status: 'active' | 'archived';

  createdAt: Date;
  updatedAt: Date;
}

export const TermSchema = SchemaFactory.createForClass(Term);
