import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { School } from '../../schools/schemas/school.schema';
import { User } from 'src/users/schemas/user.schema';

@Schema({ timestamps: true })
export class Student extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  admissionClass: string;

  @Prop({
    type: String,
    enum: ['active', 'graduated', 'transferred'],
    default: 'active',
  })
  currentStatus: 'active' | 'graduated' | 'transferred';

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  age: number;

  @Prop({})
  class: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  guardianName: string;

  @Prop({ required: true })
  address: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'School' })
  schoolId: School;

  @Prop()
  recordsId: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
