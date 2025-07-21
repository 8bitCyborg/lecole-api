import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student } from './schemas/student.schema';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { AssessmentRecord } from 'src/assessment-records/schemas/assessment-records.schema';
import { Class } from 'src/classes/schemas/classes.schema';
import { AuthUtilsService } from 'src/auth/authUtils/auth.utils';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(AssessmentRecord.name)
    private assessmentRecordModel: Model<AssessmentRecord>,
    @InjectModel(Class.name)
    private classModel: Model<Class>,
    private AuthUtilsService: AuthUtilsService,
  ) {}

  async addStudent(
    schoolId: string,
    studentData: {
      classId: string;
      termId: string;
      sessionId: string;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
    },
  ) {
    try {
      const { email, phone, firstName, lastName } = studentData;
      const newId = new ObjectId();
      const user = await this.userModel.create({
        email,
        firstName,
        lastName,
        phone,
        schoolId,
        password: await this.AuthUtilsService.hashPassword('0000'),
        role: 'student',
        loginId: 'STU-' + newId.toString().slice(-5).toUpperCase(),
      });

      const student = await this.studentModel.create({
        ...studentData,
        class: studentData.classId,
        userId: user._id,
        schoolId,
      });

      const classInfo = await this.classModel.findById(studentData.classId);
      // const subjects = classInfo?.subjects.map((subject) => {
      //   return {
      //     subjectId: subject,
      //     ca: 0,
      //     exam: 0,
      //   };
      // });

      const subjectGroups = classInfo?.subjectGroups.map((group) => {
        return {
          subjectId: group.subjectId,
          ca: 0,
          exam: 0,
        };
      });

      await this.assessmentRecordModel.create({
        studentId: student._id,
        classId: studentData.classId,
        termId: studentData.termId,
        sessionId: studentData.sessionId,
        schoolId: student.schoolId,
        subjectScores: subjectGroups,
        // subjectScores: subjects,
      });

      return student;
    } catch (error: any) {
      console.log('error creating student: ', error);
      return false;
    }
  }

  async bulkEntry(
    schoolId,
    students: {
      classId: string;
      termId: string;
      sessionId: string;
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
    }[],
  ) {
    const data = students;
    const operations = data.map(async (studentData) => {
      const { email, phone, firstName, lastName } = studentData;
      const newId = new ObjectId();
      const user = await this.userModel.create({
        email,
        firstName,
        lastName,
        phone,
        schoolId,
        password: await this.AuthUtilsService.hashPassword('0000'),
        role: 'student',
        loginId: 'STU-' + newId.toString().slice(-5).toUpperCase(),
      });

      const student = await this.studentModel.create({
        ...studentData,
        class: studentData.classId,
        userId: user._id,
        schoolId,
      });

      const classInfo = await this.classModel.findById(studentData.classId);
      const subjects = classInfo?.subjects.map((subject) => {
        return {
          subjectId: subject,
          ca: 0,
          exam: 0,
        };
      });

      const subjectGroups = classInfo?.subjectGroups.map((group) => {
        return {
          subjectId: group.subjectId,
          ca: 0,
          exam: 0,
        };
      });

      const newRecord = await this.assessmentRecordModel.create({
        studentId: student._id,
        classId: studentData.classId,
        termId: studentData.termId,
        sessionId: studentData.sessionId,
        schoolId: student.schoolId,
        subjectScores: subjectGroups,
        // subjectScores: subjects,
      });

      return student;
    });

    await Promise.all(operations);
  }

  async getAllStudents(schooId: string) {
    try {
      const students = await this.studentModel
        .find({ schoolId: schooId })
        .populate('classId')
        .populate('armId');
      return students;
    } catch (error) {
      console.log('error getting students: ', error);
      return false;
    }
  }

  async getStudent(studentId: string) {
    try {
      const student = await this.studentModel
        .findById(studentId)
        .populate('classId')
        .populate('schoolId')
        .populate('userId');
      return student;
    } catch (error) {
      console.log('error getting student: ', error);
      return false;
    }
  }

  async getStudentsByClassId(classId: string) {
    try {
      const student = await this.studentModel.findOne({ classId: classId });
      return student;
    } catch (error) {
      console.log('error getting student: ', error);
      return false;
    }
  }

  async promoteAll(schoolId: string) {
    const classes = await this.classModel.find({ schoolId: schoolId });

    // Sort classes by order descending to process highest classes first
    const sortedClasses = classes.sort((a, b) => b.order - a.order);

    for (const currentClass of sortedClasses) {
      const nextClass = classes.find(
        (cls) => cls.order == currentClass.order + 1,
        // cls.order == currentClass.order + 1 && cls.arm == currentClass.arm,
      );
      if (!nextClass) {
        await this.studentModel.updateMany(
          { classId: currentClass._id },
          { $set: { currentStatus: 'graduated' } },
        );
        continue;
      }
      const students = await this.studentModel.find({
        classId: currentClass._id,
      });
      for (const student of students) {
        await this.studentModel.findByIdAndUpdate(student._id, {
          classId: nextClass._id,
        });
      }
    }
  }

  async promoteByCriteria(
    schoolId: string,
    promotionCriteria: number,
    sessionId: string,
  ) {
    const classes = await this.classModel.find({ schoolId: schoolId });

    // Sort classes by order descending to process highest classes first
    const sortedClasses = classes.sort((a, b) => b.order - a.order);

    for (const currentClass of sortedClasses) {
      const nextClass = classes.find(
        (cls) => cls.order == currentClass.order + 1,
        // cls.order == currentClass.order + 1 && cls.arm == currentClass.arm,
      );
      if (!nextClass) {
        const students = await this.studentModel.find({
          classId: currentClass._id,
        });

        for (const student of students) {
          const assessmentRecords = await this.assessmentRecordModel.find({
            sessionId,
            studentId: student._id,
          });

          if (assessmentRecords.length > 0) {
            let totalScore = 0;
            let totalSubjects = 0;

            assessmentRecords.forEach((record) => {
              record.subjectScores.forEach((subjectScore) => {
                const ca = subjectScore.ca || 0;
                const exam = subjectScore.exam || 0;
                totalScore += ca + exam;
                totalSubjects++;
              });
            });

            const averageScore =
              totalSubjects > 0 ? totalScore / totalSubjects : 0;

            if (averageScore >= promotionCriteria) {
              const graduatedStudents =
                await this.studentModel.findByIdAndUpdate(student._id, {
                  $set: { currentStatus: 'graduated' },
                });
            }
          }
        }
        continue;
      }

      const students = await this.studentModel.find({
        classId: currentClass._id,
      });

      for (const student of students) {
        const assessmentRecords = await this.assessmentRecordModel.find({
          sessionId,
          studentId: student._id,
        });

        if (assessmentRecords.length > 0) {
          let totalScore = 0;
          let totalSubjects = 0;

          assessmentRecords.forEach((record) => {
            record.subjectScores.forEach((subjectScore) => {
              const ca = subjectScore.ca || 0;
              const exam = subjectScore.exam || 0;
              totalScore += ca + exam;
              totalSubjects++;
            });
          });

          const averageScore =
            totalSubjects > 0 ? totalScore / totalSubjects : 0;

          if (averageScore >= promotionCriteria) {
            const currentStudent = await this.studentModel.findByIdAndUpdate(
              student._id,
              { classId: nextClass._id },
            );
          }
        }
      }
    }
  }

  async getStudentByUserId(userId: string) {
    return await this.studentModel
      .findOne({ userId: userId })
      .populate('classId')
      .populate('schoolId')
      .populate('userId');
  }

  async updateStudentProfile(studentId: string, updateData: Student) {
    return await this.studentModel.findByIdAndUpdate(studentId, updateData);
  }
}
