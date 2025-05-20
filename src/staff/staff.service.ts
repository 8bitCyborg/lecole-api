import { Injectable } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ObjectId } from 'mongodb';
import { Staff } from './schemas/staff.schema';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Staff.name) private staffModel: Model<Staff>,
  ) {}
  async create(schoolId, staffData: CreateStaffDto) {
    try {
      const { email, phone, firstName, lastName, position, type } = staffData;
      const newId = new ObjectId();
      const user = await this.userModel.create({
        email,
        firstName,
        lastName,
        phone,
        schoolId,
        password: '0987',
        role: 'staff',
        loginId: 'STA-' + newId.toString().slice(-5).toUpperCase(),
      });
      const staff = await this.staffModel.create({
        ...staffData,
        schoolId,
        userId: user._id,
      });
      return staff;
    } catch (error) {
      console.log('Error creating staff: ', error);
      return false;
    }
  }

  findAll() {
    return `This action returns all staff`;
  }

  async getAllStaff(schoolId: string) {
    try {
      const staff = await this.staffModel.find({ schoolId }).populate('userId');
      return staff;
    } catch (error) {
      console.log('Error getting staff: ', error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} staff`;
  }

  update(id: number, updateStaffDto: UpdateStaffDto) {
    return `This action updates a #${id} staff`;
  }

  remove(id: number) {
    return `This action removes a #${id} staff`;
  }
}
