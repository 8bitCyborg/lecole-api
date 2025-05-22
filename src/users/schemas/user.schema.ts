import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { School } from '../../schools/schemas/school.schema';

export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  STUDENT = 'student',
  SUBADMIN = 'subadmin',
  TEACHER = 'teacher',
  STAFF = 'staff',
  EXAMS = 'exam',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: false })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  loginId: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  profilePicture: string;

  @Prop({ required: true, default: 'student' })
  role: UserRole;
  // @Prop({
  //   type: String,
  //   enum: UserRole,
  // })
  // role: UserRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  password: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'School' })
  schoolId: School;
}

export const UserSchema = SchemaFactory.createForClass(User);
