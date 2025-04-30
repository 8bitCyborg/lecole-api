import { Session } from './schemas/session.schema';
import { Injectable } from '@nestjs/common';
import { UpdateSessionDto } from './dto/update-session.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';

@Injectable()
export class SessionsService {
  constructor(@InjectModel(Session.name) private sessionModel) {}

  async createSession(schoolId) {
    try {
      const session: Session = await this.sessionModel.create({
        schoolId: schoolId,
      });

      console.log('Session created: ', session);
      return session;
    } catch (error) {
      console.log('error creating session: ', error);
      return error;
    }
  }

  findAll() {
    return `This action returns all sessions`;
  }

  async findOne(sessionId: string) {
    try {
      const session = await this.sessionModel
        .find({ _id: sessionId })
        .populate('schoolId');
      console.log('Session retrieved: ', session);
      return session;
    } catch (error) {
      console.log('error fetching session: ', error);
      return false;
    }
  }

  update(id: number, updateSessionDto: UpdateSessionDto) {
    return `This action updates a #${id} session`;
  }

  remove(id: number) {
    return `This action removes a #${id} session`;
  }
}
