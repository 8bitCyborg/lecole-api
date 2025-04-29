import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
}

@Schema({ timestamps: true })
export class School extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  address?: string;

  @Prop()
  email?: string;

  @Prop()
  phone?: string;

  @Prop()
  logoUrl?: string;

  @Prop({
    type: String,
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  subscriptionStatus: SubscriptionStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Session' })
  currentSessionId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Term' })
  currentTermId?: MongooseSchema.Types.ObjectId;
}

export const SchoolSchema = SchemaFactory.createForClass(School);
