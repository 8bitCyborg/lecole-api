import { Injectable } from '@nestjs/common';
import { CreateSchoolDto } from './dto/create-school.dto';
import { UpdateSchoolDto } from './dto/update-school.dto';
import { InjectModel } from '@nestjs/mongoose';
import { School } from './schemas/school.schema';
import { User } from 'src/users/schemas/user.schema';
import { Class } from 'src/classes/schemas/classes.schema';
import { Model } from 'mongoose';
import { Term } from 'src/terms/schemas/term.schema';
import { AssessmentRecord } from 'src/assessment-records/schemas/assessment-records.schema';
import { Subject } from 'src/subjects/schemas/subject.schema';
import { Student } from 'src/students/schemas/student.schema';
import { Response } from 'express';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectModel(School.name) private schoolModel,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Class.name) private classModel: Model<Class>,
    @InjectModel(Term.name) private termModel: Model<Term>,
    @InjectModel(AssessmentRecord.name) private assessmentRecordModel: Model<Term>,
    @InjectModel(Subject.name) private subjectModel: Model<Term>,
    @InjectModel(Student.name) private studentModel: Model<Term>,
  ) {}

  async createSchool(schoolDetails: CreateSchoolDto, res?: Response) {
    function getInitials(str) {
      return str
        .split(/\s+/) // split by spaces
        .filter(Boolean) // remove empty strings
        .map((word) => word[0].toUpperCase()) // get first letter and capitalize
        .join('');
    }

    try {
      const checkIfSchoolExists = await this.schoolModel.findOne({
        name: schoolDetails.name,
        founderFirstName: schoolDetails.founderFirstName, 
        founderLastName: schoolDetails.founderLastName
      });
      if(checkIfSchoolExists) {
        return res?.status(400).send({
          message: 'School already exists',
          status: 400,
        });
      };

      const school = await this.schoolModel.create({
        ...schoolDetails,
        phone: [schoolDetails.phone],
      });
      school.shortCode = `${getInitials(school.name)}-${school._id.toString().slice(-3)}`;
      school.save();

      const defaultClasses = [
        {name: "Creche", alt: "Day Care",order: 1, arm: "A"},
        {name: "Nursery 1", alt: "Kindergarten 1", order: 2, arm: "A"},
        {name: "Nursery 2", alt: "Kindergarten 2", order: 3, arm: "A"},
        {name: "Nursery 3", alt: "Kindergarten 3", order: 4, arm: "A"},
        {name: "Primary 1", alt: "Grade 1", order: 5, arm: "A"},
        {name: "Primary 2", alt: "Grade 2", order: 6, arm: "A"},
        {name: "Primary 3", alt: "Grade 3", order: 7, arm: "A"},
        {name: "Primary 4", alt: "Grade 4", order: 8, arm: "A"},
        {name: "Primary 5", alt: "Grade 5", order: 9, arm: "A"},
        {name: "Primary 6", alt: "Grade 6", order: 10, arm: "A"},
        {name: "JSS 1", alt: "Grade 7", order: 11, arm: "A"},
        {name: "JSS 2", alt: "Grade 8", order: 12, arm: "A"},
        {name: "JSS 3", alt: "Grade 9", order: 13, arm: "A"},
        {name: "SSS 1", alt: "Grade 10", order: 14, arm: "A"},
        {name: "SSS 2", alt: "Grade 11", order: 15, arm: "A"},
        {name: "SSS 3", alt: "Grade 12", order: 16, arm: "A"},      
      ]

      const classDocs = defaultClasses.map((classItem) => ({
        name: classItem.name,
        alt: classItem.alt,
        order: classItem.order,
        arm: classItem.arm,
        schoolId: school._id,
      }));
      await this.classModel.insertMany(classDocs);

      return school;
    } catch (error) {
      console.log('Error creating school: ', error);
      return error;
    }
  }

  findAll() {
    return `This action returns all schools`;
  }

  async findOne(id: string) {
    try {
      const school = await this.schoolModel
        .findById(id)
        .populate('currentSessionId')
        .populate('currentTermId')
      if (!school) {
        return `School with id ${id} not found`;
      }
      return school;
    } catch (error) {
      console.log('Error finding school: ', error);
    }
    return `This action returns a #${id} school`;
  }

  update(id: number, updateSchoolDto: UpdateSchoolDto) {
    return `This action updates a #${id} school`;
  }

  async updateGrade(schoolId: string, gradeUpdate: any) {
    try {
      const schoolUpdate = await this.schoolModel.findByIdAndUpdate(
        schoolId,
        { gradingScheme: gradeUpdate },
        { new: true },
      );

      return schoolUpdate.gradingScheme;
    } catch (error) {
      console.log('Error updating grade: ', error);
      return `Error updating grade for school with id ${schoolId}`;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} school`;
  }

async  endTerm(schoolId: string, termId) {
  console.log("SchoolD: ", schoolId, "TermId: ", termId);
   const term = await this.termModel.findByIdAndUpdate(
      termId,
      { status: "ended" },
      { new: true },
    );
    const school = await this.schoolModel.findByIdAndUpdate(
      schoolId,
      { currentTermId: null, },
      { new: true },
    );

    return school
  }

async  beginTerm(schoolId: string, termId) {
  console.log("SchoolD: ", schoolId, "TermId: ", termId);
   const term = await this.termModel.findByIdAndUpdate(
      termId,
      { status: "active" },
      { new: true },
    );
    const school = await this.schoolModel.findByIdAndUpdate(
      schoolId,
      { currentTermId: termId, },
      { new: true },
    );

  const schoolData = await this.schoolModel.findById(schoolId)
  const classes = await this.classModel.find({schoolId: schoolId})

 const operations = classes.map(async (classItem) => {
    const students = await this.studentModel.find({classId: classItem._id})
    const subjects = classItem?.subjects.map((subject) => {
        return {
          subjectId: subject,
          ca: 0,
          exam: 0,
        };
      });

      students.forEach( async(student) => {
        const record = await this.assessmentRecordModel.find({
          studentId: student._id, 
          classId: classItem.id, 
          termId: termId, 
          sessionId: schoolData.currentSessionId, 
          schoolId: schoolId
        })
        if (!record || record?.length == 0) {
          await this.assessmentRecordModel.create({
           studentId: student._id,
           classId: classItem.id,
           termId: termId,
           sessionId: schoolData.currentSessionId,
           schoolId: schoolId,
           subjectScores: subjects,
         });
        }
      })
    });
    await Promise.all(operations)
    return school
  }
}
