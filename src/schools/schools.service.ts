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
    function getInitials(str) {
      return str
        .split(/\s+/) // split by spaces
        .filter(Boolean) // remove empty strings
        .map((word) => word[0].toUpperCase()) // get first letter and capitalize
        .join('');
    }

    try {
      const school = await this.schoolModel.create({
        ...schoolDetails,
        phone: [schoolDetails.phone],
      });
      console.log('School created: ', school);
      school.shortCode =
        getInitials(school.name) + school._id.toString().slice(-3);
      school.save();
      return school;
    } catch (error) {
      // console.log('School details: ', schoolDetails);
      console.log('Error creating school: ', error);
    }
  }

  findAll() {
    return `This action returns all schools`;
  }

  async findOne(id: string) {
    try {
      const school = await this.schoolModel.findById(id);
      console.log('School found: ', school);
      if (!school) {
        return `School with id ${id} not found`;
      }
      return school;
    } catch (error) {
      console.log('Error finding school: ', error);
    }
    return `This action returns a #${id} school`;
  }

  update(id: number, updateSchoolDto: UpdateSchoolDto) {
    return `This action updates a #${id} school`;
  }

  remove(id: number) {
    return `This action removes a #${id} school`;
  }
}
