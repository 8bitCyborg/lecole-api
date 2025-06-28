import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student } from './schemas/student.schema';
import { User } from 'src/users/schemas/user.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { AssessmentRecord } from 'src/assessment-records/schemas/assessment-records.schema';
import { Class } from 'src/classes/schemas/classes.schema';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
    @InjectModel(User.name) private userModel: Model<User>, 
    @InjectModel(AssessmentRecord.name)
    private assessmentRecordModel: Model<AssessmentRecord>,
    @InjectModel(Class.name)
    private classModel: Model<Class>,

  ) {}

  async addStudent(schoolId, studentData) {
    try {
      const { email, phone, firstName, lastName } = studentData;
      const newId = new ObjectId();
      const user = await this.userModel.create({
        email,
        firstName,
        lastName,
        phone,
        schoolId,
        password: '0987',
        role: 'student',
        loginId: 'STU-' + newId.toString().slice(-5).toUpperCase(),
      });

      const student = await this.studentModel.create({
        ...studentData,
        class: studentData.classId,
        userId: user._id,
        schoolId,
      });

      const classInfo = await this.classModel.findById(studentData.classId)
      const subjects = classInfo?.subjects.map((subject) => {
        return {
          subjectId: subject,
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
        subjectScores: subjects,
      });
              

      return student;
    } catch (error: any) {
      console.log('error creating student: ', error);
      return false;
    }
  }

  async bulkEntry (schoolId, students) {
    const data = students
    const operations = data.map(async (studentData) => {
      const { email, phone, firstName, lastName } = studentData;
      const newId = new ObjectId();
      const user = await this.userModel.create({
        email,
        firstName,
        lastName,
        phone,
        schoolId,
        password: '0987',
        role: 'student',
        loginId: 'STU-' + newId.toString().slice(-5).toUpperCase(),
      });

      const student = await this.studentModel.create({
        ...studentData,
        class: studentData.classId,
        userId: user._id,
        schoolId,
      });

      const classInfo = await this.classModel.findById(studentData.classId)
      const subjects = classInfo?.subjects.map((subject) => {
        return {
          subjectId: subject,
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
        subjectScores: subjects,
      });

      return student
    });

    await Promise.all(operations);
  }

  async getAllStudents(schooId: string) {
    try {
      const students = await this.studentModel
        .find({ schoolId: schooId })
        .populate('classId');
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
        .populate('schoolId');
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
    const classes = await this.classModel.find({schoolId: schoolId})

    classes.forEach(async (currentClass) => {
      const nextClass = classes.find(cls => cls.order == currentClass.order + 1 && cls.arm == currentClass.arm)
      if (!nextClass) {
        const graduatedStudents = await this.studentModel.updateMany({classId: currentClass._id}, {$set: {currentStatus: "graduated"}})
        return;
      }
      const students = await this.studentModel.find({classId: currentClass._id})
      students.map(async (student) => {
       const currentStudent = await this.studentModel.findByIdAndUpdate(student._id, {classId: nextClass._id}) 
      })
    })
  }
}
