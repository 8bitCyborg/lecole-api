import { Injectable } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { InjectModel } from '@nestjs/mongoose';
import { School } from './schemas/school.schema';
import { User } from 'src/users/schemas/user.schema';
import { Class } from 'src/classes/schemas/classes.schema';
import { Model } from 'mongoose';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectModel(School.name) private schoolModel,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Class.name) private classModel: Model<Class>,
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
      school.shortCode =
        getInitials(school.name) + school._id.toString().slice(-3);
      school.save();

      const defaultClasses = [
        'Nursery 1',
        'Nursery 2',
        'Nursery 3',
        'Primary 1',
        'Primary 2',
        'Primary 3',
        'Primary 4',
        'Primary 5',
        'Primary 6',
        'JSS 1',
        'JSS 2',
        'JSS 3',
        'SS 1',
        'SS 2',
        'SS 3',
      ];

      const classDocs = defaultClasses.map((className) => ({
        name: className,
        schoolId: school._id,
      }));

      await this.classModel.insertMany(classDocs);

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

  async updateGrade(schoolId: string, gradeUpdate: any) {
    try {
      const schoolUpdate = await this.schoolModel.findByIdAndUpdate(
        schoolId,
        { gradingScheme: gradeUpdate },
        { new: true },
      );

      return schoolUpdate.gradingScheme;
    } catch (error) {
      console.log('Error updating grade: ', error);
      return `Error updating grade for school with id ${schoolId}`;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} school`;
  }
}
