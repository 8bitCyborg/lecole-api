import { Session } from './../../sessions/schemas/session.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Staff } from 'src/staff/schemas/staff.schema';
import { Student } from 'src/students/schemas/student.schema';
import { GradingScheme } from './grading.schama';
import { AnnouncementsSchema } from './announcement.schema';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  INACTIVE = 'inactive',
}

@Schema({ timestamps: true })
export class School extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  superVisorId: string;

  @Prop()
  shortCode: string;

  @Prop({ required: true })
  founderFirstName: string;

  @Prop({ required: true })
  founderLastName: string;

  @Prop()
  dataFounded: Date;

  @Prop()
  address?: string;

  @Prop()
  email?: string;

  @Prop()
  phone?: string[];

  @Prop()
  logoUrl?: string;

  @Prop()
  motto?: string;

  @Prop({
    type: String,
    enum: SubscriptionStatus,
    default: SubscriptionStatus.INACTIVE,
  })
  subscriptionStatus: SubscriptionStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Session' })
  currentSessionId?: MongooseSchema.Types.ObjectId;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Student' }])
  students?: Student[];

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Staff' }])
  staff?: Staff[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Term' })
  currentTermId?: MongooseSchema.Types.ObjectId;

  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'Term' }])
  sessionIds: Session[];

  @Prop({ type: GradingScheme, default: () => ({}) })
  gradingScheme: GradingScheme;

  @Prop({ default: 'all' })
  promotionCriteria: 'all' | 'performance';

  @Prop()
  promotionScore: number;

  @Prop({ type: [AnnouncementsSchema] })
  announcements: AnnouncementsSchema[];
}

export const SchoolSchema = SchemaFactory.createForClass(School);
