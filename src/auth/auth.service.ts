import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { AuthDto, LoginDto } from './dto/auth.dto';
import { Tokens } from './types/tokens.type';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) { }

  async signupLocal(dto: AuthDto) {
    const hashedPassword = await this.hashData(dto.password);
    const newUser = await this.userService.createUser({
      email: dto.email,
      first_name: dto.first_name,
      last_name: dto.last_name,
      phone: dto.phone,
      hashedPassword,
    });

    const tokens = await this.getTokens(newUser.id, newUser.email, null);
    const hashedRt = await this.hashData(tokens.refresh_token);
    await this.userService.updateHashedRt(newUser.id, hashedRt);

    const { password: _, ...user } = newUser;

    return { user, tokens };
  }

  async signinLocal(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) throw new ForbiddenException('User not found.');

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) throw new ForbiddenException('Incorrect Email/Password');

    const school = await this.prisma.school.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    const tokens = await this.getTokens(user.id, user.email, school?.id || null);
    const hashedRt = await this.hashData(tokens.refresh_token);
    await this.userService.updateHashedRt(user.id, hashedRt);

    const { password: _, ...userData } = user;

    return { user: userData, tokens };
  };

  async logout(userId: string) {
    await this.userService.clearHashedRt(userId);
  }

  async refreshTokens(userId: string, rt: string) {
    const user = await this.userService.findById(userId);

    if (!user || !user.hashedRt) throw new ForbiddenException('Access Denied');

    const rtMatches = await bcrypt.compare(rt, user.hashedRt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const school = await this.prisma.school.findFirst({
      where: { userId: user.id },
      select: { id: true },
    });

    const tokens = await this.getTokens(user.id, user.email, school?.id || null);
    const hashedRt = await this.hashData(tokens.refresh_token);
    await this.userService.updateHashedRt(user.id, hashedRt);

    return tokens;
  }

  hashData(data: string) {
    return bcrypt.hash(data, 10);
  }

  async getTokens(userId: string, email: string, schoolId: string | null): Promise<Tokens> {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email, schoolId },
        {
          secret: process.env.JWT_AT_SECRET || 'at-secret',
          expiresIn: 60 * 15, // 15 minutes
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email, schoolId },
        {
          secret: process.env.JWT_RT_SECRET || 'rt-secret',
          expiresIn: 60 * 60 * 24 * 7, // 7 days
        },
      ),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
