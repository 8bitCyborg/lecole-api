import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class, ClassSchema } from './schemas/classes.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AssessmentRecord } from 'src/assessment-records/schemas/assessment-records.schema';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(Class.name) private classModel: Model<Class>,
    @InjectModel(AssessmentRecord.name)
    private assessmentRecordModel: Model<AssessmentRecord>,
  ) {}

  async findAll(schoolId: string) {
    const classes = await this.classModel
      .find({ schoolId: schoolId })
      .populate('subjects')
      .populate('subjectGroups.subjectId')
      .populate({
        path: 'classTeacher',
        populate: {
          path: 'userId',
        },
      });
    return classes;
  }

  async findClass(classId: string) {
    const classData = await this.classModel.findById(classId);
    // .populate('subjects');
    return classData;
  }

  async update(id: string, termId: string, updateClassDto: UpdateClassDto) {
    const updatedClass = await this.classModel.findByIdAndUpdate(
      id,
      updateClassDto,
      { new: true },
    );

    if (!termId || termId == undefined) {
      return updatedClass;
    }

    const assessmentRecords = await this.assessmentRecordModel.find({
      classId: id,
      termId: termId,
    });

    for (const record of assessmentRecords) {
      const currentSubjectIds = record.subjectScores.map((a) =>
        a.subjectId.toString(),
      );

      // Extract subjectIds from subjectGroups
      const updatedClassSubjectIds =
        updatedClass?.subjectGroups?.flatMap((group) =>
          group.subjectId.toString(),
        ) || [];

      const toAdd = updatedClassSubjectIds.filter(
        (id) => !currentSubjectIds.includes(id),
      );
      console.log('Subjects to add: ', toAdd);
      console.log(
        'Updated class subject IDs from subjectGroups: ',
        updatedClassSubjectIds,
      );

      const toRemove = currentSubjectIds.filter((id) => {
        return !updatedClassSubjectIds.includes(id);
      });

      // Remove subjects
      record.subjectScores = record.subjectScores.filter(
        (a) => !toRemove.includes(a.subjectId.toString()),
      );

      // Add subjectScores for new subjects
      toAdd?.forEach((subjectId) => {
        console.log('Adding subject score for: ', subjectId);
        record.subjectScores.push({
          subjectId: new mongoose.Types.ObjectId(subjectId.toString()),
          ca: 0,
          exam: 0,
          remark: '',
        });
      });

      await record.save();
    }

    return updatedClass;
  }

  remove(id: number) {
    return `This action removes a #${id} class`;
  }
}
