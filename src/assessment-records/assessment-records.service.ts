import { Injectable } from '@nestjs/common';
import { CreateAssessmentRecordDto } from './dto/create-assessment-record.dto';
import { UpdateAssessmentRecordDto } from './dto/update-assessment-record.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AssessmentRecord } from './schemas/assessment-records.schema';

@Injectable()
export class AssessmentRecordsService {
  constructor(
    @InjectModel(AssessmentRecord.name) private assessmentRecordModel,
  ) {}
  create(createAssessmentRecordDto: CreateAssessmentRecordDto) {
    return 'This action adds a new assessmentRecord';
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
