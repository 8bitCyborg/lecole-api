import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { School } from '../../schools/schemas/school.schema';

export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  SUBADMIN = 'subadmin',
  FINANCE = 'finance',
  EXAMS = 'exam',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: false })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.SUPERADMIN,
  })
  role: UserRole;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({ required: true })
  password: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'School' })
  school: School;

  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
