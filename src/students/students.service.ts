import { Injectable } from '@nestjs/common';
import { Students } from './entity/student.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentDto } from './entity/student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Students) private studentRepository: Repository<Students>,
  ) {}

  addStudent(studentData: StudentDto) {
    try {
      const student = this.studentRepository.create(studentData);
      console.log('Student created: ', student);
      return this.studentRepository.save(student);
    } catch (error: any) {
      console.log('error creating student: ', error);
      return error;
    }
  }

  getAllStudents(schooId: string) {
    try {
      return this.studentRepository.find();
    } catch (error) {
      console.log('error getting students: ', error);
      return false;
    }
  }
}
