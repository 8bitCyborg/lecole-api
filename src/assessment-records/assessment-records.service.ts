import { Injectable } from '@nestjs/common';
// import { UpdateAssessmentRecordDto } from './dto/update-assessment-record.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AssessmentRecord } from './schemas/assessment-records.schema';
import { Model } from 'mongoose';
import { AssessmentRecordType } from '../../types';

@Injectable()
export class AssessmentRecordsService {
  constructor(
    @InjectModel(AssessmentRecord.name)
    private assessmentRecordModel: Model<AssessmentRecord>,
  ) {}

  async getStudentRecords(recordDetails: {
    studentId: string;
    classId: string;
    termId: string;
    sessionId: string;
    schoolId: string;
    subjectScores: string[];
    subjectGroups: { subjectId: string; teacherId: string }[];
  }) {
    const records = await this.assessmentRecordModel
      .findOne({
        studentId: recordDetails.studentId,
        classId: recordDetails.classId,
        termId: recordDetails.termId,
        sessionId: recordDetails.sessionId,
        schoolId: recordDetails.schoolId,
      })
      .populate('subjectScores.subjectId');
    if (!records) {
      const subjectGroups = recordDetails?.subjectGroups.map(
        (group: { subjectId: string; teacherId: string }) => {
          return {
            subjectId: group.subjectId,
            ca: 0,
            exam: 0,
          };
        },
      );

      const newRecord = await this.assessmentRecordModel.create({
        studentId: recordDetails.studentId,
        classId: recordDetails.classId,
        termId: recordDetails.termId,
        sessionId: recordDetails.sessionId,
        schoolId: recordDetails.schoolId,
        subjectScores: subjectGroups,
      });

      const populatedResult = await this.assessmentRecordModel
        .findById(newRecord._id)
        .populate('subjectScores.subjectId');

      return populatedResult;
    }
    return records;
  }

  async updateRecord(recordId, recordData) {
    try {
      const record = await this.assessmentRecordModel.findByIdAndUpdate(
        recordId,
        { subjectScores: recordData },
        { new: true },
      );
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

  async getRecordsBySubjects(
    termId: string,
    subjectId: string,
    classId: string,
  ) {
    try {
      const records = await this.assessmentRecordModel
        .find({
          termId: termId,
          classId: classId,
          'subjectScores.subjectId': subjectId,
        })
        .populate('studentId');
      return records;
    } catch (error) {
      console.log('Error', error);
      // return
    }
  }

  async bulkSave(records: AssessmentRecordType[]) {
    const data = Object.values(records);
    const operations = data.map(async (record: AssessmentRecordType) => {
      await this.assessmentRecordModel.findByIdAndUpdate(
        record._id,
        { subjectScores: record.subjectScores },
        { new: true },
      );
    });

    await Promise.all(operations);

    return operations;
  }

  async getAllRecords(schoolId: string) {
    return await this.assessmentRecordModel
      .find({ schoolId: schoolId })
      .populate('studentId')
      .populate('classId')
      .populate('termId')
      .populate('sessionId');
  }

  async findByStudentIdTermId(studentId: string, termId: string) {
    const record = await this.assessmentRecordModel.findOne({
      studentId: studentId,
      termId: termId,
    });
    return record;
  }

  async findByRecordId(recordId: string) {
    return await this.assessmentRecordModel
      .findById(recordId)
      .populate('studentId')
      .populate('classId')
      .populate('termId')
      .populate('sessionId')
      .populate('subjectScores.subjectId');
  }
}
