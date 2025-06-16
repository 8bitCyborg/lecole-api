import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subject } from './schemas/subject.schema';
import { Model } from 'mongoose';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<Subject>,
  ) {}

  async create(schoolId: string, createSubject: CreateSubjectDto) {
    return this.subjectModel.create({
      ...createSubject,
      schoolId,
    });
  }

  async findAll(schoolId: string) {
    return this.subjectModel.find({ schoolId });
  }

  async findOne(id: string) {
    const subject = await this.subjectModel.findById(id);
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto) {
    const updatedSubject = await this.subjectModel.findByIdAndUpdate(
      id,
      updateSubjectDto,
      { new: true },
    );
    if (!updatedSubject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return updatedSubject;
  }

  async bulkCreate(schoolId: string, subjects: CreateSubjectDto[]) {
    const subjectDocuments = subjects.map((subject) => ({
      ...subject,
      schoolId,
    }));
    return this.subjectModel.insertMany(subjectDocuments);
  }

  async remove(id: string) {
    const deletedSubject = await this.subjectModel.findByIdAndDelete(id);
    if (!deletedSubject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return deletedSubject;
  }
}
