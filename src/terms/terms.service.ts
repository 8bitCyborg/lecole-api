import { Injectable } from '@nestjs/common';
import { CreateTermDto } from './dto/create-term.dto';
import { UpdateTermDto } from './dto/update-term.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Term } from './schemas/term.schema';
import { Model } from 'mongoose';

@Injectable()
export class TermsService {
  constructor(@InjectModel(Term.name) private termModel: Model<Term>) {}

  async findAll(sessionId: string) {
    const terms = await this.termModel.find({ sessionId: sessionId });
    return terms;
  }
}
