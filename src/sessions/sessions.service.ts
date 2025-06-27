import { Session } from './schemas/session.schema';
import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { UpdateSessionDto } from './dto/update-session.dto';
import { InjectModel } from '@nestjs/mongoose';
import { School } from 'src/schools/schemas/school.schema';
import { Term } from 'src/terms/schemas/term.schema';

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);
  constructor(
    @InjectModel(Session.name) private sessionModel,
    @InjectModel(School.name) private schoolModel,
    @InjectModel(Term.name) private termModel,
  ) {}

  async createSession(schoolId, sessioData: { year: string }) {
    try {
      const sessionExists = await this.sessionModel.findOne({
        schoolId: schoolId,
        year: sessioData.year,
      });
      if (sessionExists) {
        throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
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
          status: "active"
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

      return session;
    } catch (error) {
      console.log('error creating session: ', error);
      throw error;
    }
  }

  async findAll(schoolId: string) {
    try {
      const sessions = await this.sessionModel
        .find({ schoolId: schoolId })
        .populate('termsId');
      console.log('Schoolid sessions', schoolId, sessions);
      return sessions;
    } catch (error) {
      throw error;
    }
  }

  async findOne(sessionId: string) {
    try {
      const session = await this.sessionModel
        .find({ _id: sessionId })
        .populate('schoolId');
      // .populate('termsId');

      return session;
    } catch (error) {
      // console.log('error fetching session: ', error);
      this.logger.error('Error log: ', error.stack);
      throw error;
    }
  }

  update(id: number, updateSessionDto: UpdateSessionDto) {
    return `This action updates a #${id} session`;
  }

  remove(id: number) {
    return `This action removes a #${id} session`;
  }
}

// import { Injectable, Logger, NotFoundException } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Session } from './schemas/session.schema';
// import { UpdateSessionDto } from './dto/update-session.dto';

// @Injectable()
// export class SessionsService {
//   private readonly logger = new Logger(SessionsService.name);

//   constructor(
//     @InjectModel(Session.name)
//     private readonly sessionModel: Model<SessionDocument>,
//   ) {}

//   async createSession(schoolId: string): Promise<Session> {
//     try {
//       const newSession = new this.sessionModel({ schoolId });
//       const session = await newSession.save();

//       this.logger.log(`Session created: ${session._id}`);
//       return session;
//     } catch (error) {
//       this.logger.error('Error creating session', error.stack);
//       throw error;
//     }
//   }

//   async findAll(): Promise<Session[]> {
//     try {
//       return await this.sessionModel.find().populate('schoolId').exec();
//     } catch (error) {
//       this.logger.error('Error retrieving all sessions', error.stack);
//       throw error;
//     }
//   }

//   async findOne(sessionId: string): Promise<Session> {
//     try {
//       const session = await this.sessionModel
//         .findById(sessionId)
//         .populate('schoolId')
//         .exec();

//       if (!session) {
//         throw new NotFoundException(`Session with ID ${sessionId} not found`);
//       }

//       return session;
//     } catch (error) {
//       this.logger.error(`Error fetching session: ${sessionId}`, error.stack);
//       throw error;
//     }
//   }

//   async update(
//     sessionId: string,
//     updateSessionDto: UpdateSessionDto,
//   ): Promise<Session> {
//     try {
//       const updatedSession = await this.sessionModel
//         .findByIdAndUpdate(sessionId, updateSessionDto, { new: true })
//         .exec();

//       if (!updatedSession) {
//         throw new NotFoundException(`Session with ID ${sessionId} not found`);
//       }

//       this.logger.log(`Session updated: ${sessionId}`);
//       return updatedSession;
//     } catch (error) {
//       this.logger.error(`Error updating session: ${sessionId}`, error.stack);
//       throw error;
//     }
//   }

//   async remove(sessionId: string): Promise<{ deleted: boolean }> {
//     try {
//       const result = await this.sessionModel
//         .deleteOne({ _id: sessionId })
//         .exec();

//       if (result.deletedCount === 0) {
//         throw new NotFoundException(`Session with ID ${sessionId} not found`);
//       }

//       this.logger.log(`Session deleted: ${sessionId}`);
//       return { deleted: true };
//     } catch (error) {
//       this.logger.error(`Error deleting session: ${sessionId}`, error.stack);
//       throw error;
//     }
//   }
// }
