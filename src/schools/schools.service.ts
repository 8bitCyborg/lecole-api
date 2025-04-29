import { Injectable } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { InjectModel } from '@nestjs/mongoose';
import { School } from './schemas/school.schema';
import { User } from 'src/users/schemas/user.schema';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectModel(School.name) private schoolModel,
    @InjectModel(User.name) private userModel,
  ) {}

  async createSchool(schoolDetails: CreateSchoolDto) {
    try {
      const school = await this.schoolModel.create(schoolDetails);
      console.log('School created: ', school);
      // const user = await this.userModel.createUserData({
      //   ...schoolDetails,
      //   schoolId: school._id,
      // });
      return school;
    } catch (error) {
      console.log('Error creating school: ', error);
    }
  }

  findAll() {
    return `This action returns all schools`;
  }

  findOne(id: number) {
    return `This action returns a #${id} school`;
  }

  update(id: number, updateSchoolDto: UpdateSchoolDto) {
    return `This action updates a #${id} school`;
  }

  remove(id: number) {
    return `This action removes a #${id} school`;
  }
}
