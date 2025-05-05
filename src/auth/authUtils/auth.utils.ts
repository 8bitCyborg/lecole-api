import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthUtilsService {
  constructor(private JwtService: JwtService) {}

  async tokenize(
    _id?: string,
    email?: string,
    schoolId?: string,
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
