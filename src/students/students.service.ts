import { Injectable } from '@nestjs/common';
import { Students } from './entity/student.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentDto } from './entity/student.dto';
import { validate } from 'class-validator';
import { InjectModel } from '@nestjs/mongoose';
import { Student } from './schemas/student.schema';

@Injectable()
export class StudentsService {
  constructor(
    // @InjectRepository(Students) private studentRepository: Repository<Students>,
    @InjectModel(Student.name) private studentModel,
  ) {}

  async addStudent(studentData: StudentDto) {
    try {
      const error = await validate(studentData);

      console.log('Error: ', error);

      const student = this.studentModel.create(studentData);
      console.log('Student created: ', student);
      // return this.studentRepository.save(student);
    } catch (error: any) {
      console.log('error creating student: ', error);
      return false;
    }
  }

  getAllStudents(schooId: string) {
    try {
      return this.studentModel.find();
    } catch (error) {
      console.log('error getting students: ', error);
      return false;
    }
  }
}
