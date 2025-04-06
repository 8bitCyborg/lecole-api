import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthUtilsService {
  constructor(private JwtService: JwtService){}

  async tokenize(user?: any): Promise<string>{
    const payload = {sub: user?._id, email: user?.email};
    return this.JwtService.sign(payload);
  };

  async hashPassword(password: string): Promise<string>{
    const salt = await bcrypt.genSalt();  
    return bcrypt.hash(password, salt);
  };

  async verifyPassword(password: string, hash: string): Promise<boolean>{
    return bcrypt.compare(password, hash);
  };
};