import { ObjectId } from 'mongodb';
import { School } from '../../schools/schemas/school.schema';
export class UserDto {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password?: string;
  phone?: string;
  role?: string;
  loginId?: string;
  schoolId?: School;
}
