import { Body, Injectable, Param, Post } from '@nestjs/common';
import { CreateAssessmentRecordDto } from './dto/create-assessment-record.dto';
import { UpdateAssessmentRecordDto } from './dto/update-assessment-record.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AssessmentRecord } from './schemas/assessment-records.schema';
import { Model } from 'mongoose';

@Injectable()
export class AssessmentRecordsService {
  constructor(
    @InjectModel(AssessmentRecord.name)
    private assessmentRecordModel: Model<AssessmentRecord>,
  ) {}
  create(createAssessmentRecordDto: CreateAssessmentRecordDto) {
    return 'This action adds a new assessmentRecord';
  }

  async updateRecord(recordId, recordData) {
    try {
      const record = await this.assessmentRecordModel.findOneAndUpdate(
        {
          classId: recordId.classId,
          termId: recordId.termId,
          sessionId: recordId.sessionId,
          studentId: recordId.studentId,
        },
        recordData,
        { upsert: true, new: true },
      );
      console.log('Record: ', record);
      return record;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }
  async createRecord(studentId, recordData) {
    try {
      const record = await this.assessmentRecordModel.findByIdAndUpdate(
        studentId,
        recordData,
        { upsert: true, new: true },
      );
      console.log('Record: ', record);
      return record;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  }

  findAll() {
    return `This action returns all assessmentRecords`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assessmentRecord`;
  }

  update(id: number, updateAssessmentRecordDto: UpdateAssessmentRecordDto) {
    return `This action updates a #${id} assessmentRecord`;
  }

  remove(id: number) {
    return `This action removes a #${id} assessmentRecord`;
  }
}
