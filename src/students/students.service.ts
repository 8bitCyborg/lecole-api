import { Injectable } from '@nestjs/common';
import { StudentDto } from './entity/student.dto';
import { validate } from 'class-validator';
import { InjectModel } from '@nestjs/mongoose';
import { Student } from './schemas/student.schema';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async addStudent(schoolId, studentData: StudentDto) {
    try {
      const { email, phone, firstName, lastName } = studentData;
      const user = await this.userModel.create({
        email,
        firstName,
        lastName,
        phone,
        schoolId,
        password: '0987',
        role: 'student',
      });

      await this.studentModel.create({
        ...studentData,
        class: studentData.admissionClass,
        userId: user._id,
        schoolId,
      });
    } catch (error: any) {
      console.log('error creating student: ', error);
      return false;
    }
  }

  async getAllStudents(schooId: string) {
    try {
      const students = await this.studentModel.find({ schoolId: schooId });
      console.log('students: ', students);
      return students;
    } catch (error) {
      console.log('error getting students: ', error);
      return false;
    }
  }
}
