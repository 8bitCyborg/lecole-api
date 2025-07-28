import { Injectable } from '@nestjs/common';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class } from './schemas/classes.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { AssessmentRecord } from 'src/assessment-records/schemas/assessment-records.schema';
import { ClassArm } from './schemas/class-arm.schema';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(Class.name) private classModel: Model<Class>,
    @InjectModel(ClassArm.name) private classArmModel: Model<ClassArm>,
    @InjectModel(AssessmentRecord.name)
    private assessmentRecordModel: Model<AssessmentRecord>,
  ) {}

  async findAll(schoolId: string) {
    const classes = await this.classModel
      .find({ schoolId: schoolId })
      .populate('subjects')
      .populate('subjectGroups.subjectId')
      .populate('classArms')
      .populate({
        path: 'classArms',
        populate: {
          path: 'subjectGroups.subjectId',
        },
      })
      .populate({
        path: 'classTeacher',
        populate: {
          path: 'userId',
        },
      });
    return classes;
  }

  async updateAssessments(
    id: string,
    termId: string,
    updateClassDto: UpdateClassDto,
  ) {
    const cleanedDto = {
      ...updateClassDto,
      classTeacher:
        updateClassDto.classTeacher === ''
          ? undefined
          : updateClassDto.classTeacher,
    };

    const updatedClass = await this.classModel.findByIdAndUpdate(
      id,
      cleanedDto,
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
      // console.log('Subjects to add: ', toAdd);
      // console.log(
      //   'Updated class subject IDs from subjectGroups: ',
      //   updatedClassSubjectIds,
      // );

      const toRemove = currentSubjectIds.filter((id) => {
        return !updatedClassSubjectIds.includes(id);
      });

      // Remove subjects
      record.subjectScores = record.subjectScores.filter(
        (a) => !toRemove.includes(a.subjectId.toString()),
      );

      // Add subjectScores for new subjects
      toAdd?.forEach((subjectId) => {
        // console.log('Adding subject score for: ', subjectId);
        record.subjectScores.push({
          subjectId: new mongoose.Types.ObjectId(subjectId.toString()),
          ca: 0,
          exam: 0,
          remark: '',
        });
      });

      await record.save();
    }
    return assessmentRecords;
  }

  async update(id: string, termId: string, updateClassDto: UpdateClassDto) {
    return await this.updateAssessments(id, termId, updateClassDto);
  }

  async updateArm(id: string, termId: string, updateClassDto: UpdateClassDto) {
    const cleanedDto = {
      ...updateClassDto,
      classTeacher:
        updateClassDto.classTeacher === ''
          ? undefined
          : updateClassDto.classTeacher,
    };

    const updatedClass = await this.classArmModel.findByIdAndUpdate(
      id,
      cleanedDto,
      { new: true },
    );
    if (!termId || termId == undefined) {
      return updatedClass;
    }

    const assessmentRecords = await this.assessmentRecordModel.find({
      armId: id,
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

      const toRemove = currentSubjectIds.filter((id) => {
        return !updatedClassSubjectIds.includes(id);
      });

      // Remove subjects
      record.subjectScores = record.subjectScores.filter(
        (a) => !toRemove.includes(a.subjectId.toString()),
      );

      // Add subjectScores for new subjects
      toAdd?.forEach((subjectId) => {
        record.subjectScores.push({
          subjectId: new mongoose.Types.ObjectId(subjectId.toString()),
          ca: 0,
          exam: 0,
          remark: '',
        });
      });

      await record.save();
    }
    return assessmentRecords;
  }

  async createArm(
    classId: string,
    createClassArmDto: { name: string; alt?: string; classId: string },
  ) {
    const classArm = new this.classArmModel({
      ...createClassArmDto,
    });

    await this.classModel.findByIdAndUpdate(
      classId,
      { $push: { classArms: classArm._id } },
      { new: true },
    );
    await classArm.save();
    return classArm;
  }

  async findClass(classId: string) {
    const classData = await this.classModel
      .findById(classId)
      .populate('classArms');
    return classData;
  }

  async findClassArm(classArm: string) {
    const classData = await this.classArmModel
      .findById(classArm)
      .populate('classId');
    return classData;
  }

  async findAllClassArms(schoolId: string) {
    const arms = await this.classArmModel
      .find({ schoolId })
      .populate('classId')
      .populate({
        path: 'classTeacher',
        populate: {
          path: 'userId',
        },
      });
    console.log('All arms: ', arms);
    return arms;
  }
}
