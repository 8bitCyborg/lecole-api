import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Session extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'School', required: true })
  schoolId: Types.ObjectId;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'Term' })
  termsId: MongooseSchema.Types.ObjectId[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Term' })
  currentTermId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  year: string;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
