import { Session } from './schemas/session.schema';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { UpdateSessionDto } from './dto/update-session.dto';
import { InjectModel } from '@nestjs/mongoose';
import { School } from 'src/schools/schemas/school.schema';
import { Term } from 'src/terms/schemas/term.schema';
import { AssessmentRecord } from 'src/assessment-records/schemas/assessment-records.schema';
import { Class } from 'src/classes/schemas/classes.schema';
import { Subject } from 'src/subjects/schemas/subject.schema';
import { SchoolsService } from 'src/schools/schools.service';
import { Model } from 'mongoose';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);
  constructor(
    @InjectModel(Session.name) private sessionModel,
    @InjectModel(School.name) private schoolModel,
    @InjectModel(Term.name) private termModel,
    @InjectModel(AssessmentRecord.name) private assessmentRecordModel,
    @InjectModel(Class.name) private classModel,
    @InjectModel(Subject.name) private subjectModel,
    private readonly schoolService: SchoolsService,
  ) {}

  async createSession(schoolId, sessioData: { year: string }) {
    try {
      const sessionExists = await this.sessionModel.findOne({
        schoolId: schoolId,
        year: sessioData.year,
      });
      if (sessionExists) {
        throw new HttpException(
          'Session already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      const session: Session = await this.sessionModel.create({
        schoolId: schoolId,
        year: sessioData.year,
      });

      const terms = await this.termModel.insertMany([
        {
          sessionId: session._id,
          schoolId: schoolId,
          termIndex: 1,
          name: 'first',
          status: 'active',
        },
        {
          sessionId: session._id,
          schoolId: schoolId,
          termIndex: 2,
          name: 'second',
        },
        {
          sessionId: session._id,
          schoolId: schoolId,
          termIndex: 3,
          name: 'third',
        },
      ]);

      session.currentTermId = terms[0]._id;
      session.termsId = terms;
      await session.save();

      await this.schoolModel.findByIdAndUpdate(
        schoolId,
        {
          currentSessionId: session._id,
          currentTermId: terms[0]._id,
          $push: { sessionIds: session._id },
        },
        { new: true },
      );

      await this.schoolService.beginTerm(schoolId, session.currentTermId);

      return session;
    } catch (error) {
      console.log('error creating session: ', error);
      throw error;
    }
  }

  async findAll(schoolId: string) {
    const sessions = await this.sessionModel
      .find({ schoolId: schoolId })
      .populate('termsId');
    return sessions;
  }

  async findOne(sessionId: string) {
    try {
      const session = await this.sessionModel
        .find({ _id: sessionId })
        .populate('schoolId');
      // .populate('termsId');

      return session;
    } catch (error) {
      this.logger.error('Error log: ', error);
      throw error;
    }
  }

  async endSession(schoolId: string) {
    const school = await this.schoolModel.findByIdAndUpdate(
      schoolId,
      { currentSessionId: null, currentTermId: null },
      { new: true },
    );
    console.log('School: ', school);
    return school;
  }

  async advanceSession(schoolId: string) {
    const school = await this.schoolModel
      .findById(schoolId)
      .populate('currentSessionId');
    if (!school) {
      throw new HttpException('School not found', HttpStatus.NOT_FOUND);
    }
    if (!school.currentSessionId) {
      throw new HttpException(
        'No current session found for this school',
        HttpStatus.BAD_REQUEST,
      );
    }
    const [startStr, endStr] = school?.currentSessionId?.year.split('/');
    const start = parseInt(startStr);
    const end = parseInt(endStr);
    const nextStart = start + 1;
    const nextEnd = end + 1;

    const nextSessionYear = `${nextStart}/${nextEnd}`;
    const nextSession = await this.createSession(school._id, {
      year: nextSessionYear,
    });
    return nextSession;
  }
}
