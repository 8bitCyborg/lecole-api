import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { School } from '../../schools/schemas/school.schema';

@Injectable()
export class AuthUtilsService {
  constructor(private JwtService: JwtService) {}

  async tokenize(
    _id?: Types.ObjectId,
    email?: string,
    schoolId?: School,
  ): Promise<string> {
    const payload = {
      sub: {
        _id,
        schoolId,
      },
      email,
    };
    return this.JwtService.sign(payload);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
