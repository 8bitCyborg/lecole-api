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
      const session = await this.sessionModel.create({
        schoolId: new mongoose.Types.ObjectId(schoolId),
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

  findOne(id: number) {
    return `This action returns a #${id} session`;
  }

  update(id: number, updateSessionDto: UpdateSessionDto) {
    return `This action updates a #${id} session`;
  }

  remove(id: number) {
    return `This action removes a #${id} session`;
  }
}
