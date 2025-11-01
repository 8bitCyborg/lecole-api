import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { School } from '../../schools/schemas/school.schema';
import { User } from '../../users/schemas/user.schema';
import { ClassArm } from '../../classes/schemas/class-arm.schema';

@Schema({ timestamps: true })
export class Student extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Class' })
  classId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  middleName: string;

  // @Prop({ required: true })
  // admissionClass: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'School' })
  schoolId: School;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ClassArm' })
  armId: ClassArm;

  @Prop({
    type: String,
    enum: [
      'active',
      'graduated',
      'transferred',
      'suspended',
      'suspended',
      'expelled',
      'inactive',
    ],
    default: 'active',
  })
  currentStatus:
    | 'active'
    | 'graduated'
    | 'transferred'
    | 'suspended'
    | 'expelled'
    | 'inactive';

  @Prop({ required: true })
  gender: string;

  @Prop()
  age: number;

  @Prop({ required: true })
  class: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop()
  guardianName: string;

  @Prop()
  address: string;

  @Prop()
  recordsId: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
