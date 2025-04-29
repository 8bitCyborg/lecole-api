import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { School } from '../../schools/schemas/school.schema';

@Schema({ timestamps: true })
export class Staff extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  position: string;

  @Prop({ required: true })
  qualification: string;

  @Prop({ required: true })
  employmentDate: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'School' })
  school: School;

  createdAt: Date;
  updatedAt: Date;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);
