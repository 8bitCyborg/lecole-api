import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSchoolDto, UpdateSchoolDto } from './dto/school.dto';

import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';

@Injectable()
export class SchoolService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
    private userService: UserService,
  ) { }

  async create(dto: CreateSchoolDto) {
    const existing = await this.prisma.school.findFirst({
      where: {
        OR: [
          { email: dto.email },
          { userId: dto.userId },
          { name: dto.name },
          ...(dto.shortname ? [{ shortname: dto.shortname }] : []),
        ],
      },
    });

    if (existing) {
      throw new ConflictException(
        'A school with this name, email, or user already exists',
      );
    }

    const school = await this.prisma.school.create({
      data: {
        ...dto,
        dateOfInception: dto.dateOfInception
          ? new Date(dto.dateOfInception)
          : undefined,
      },
    });

    const user = await this.userService.findById(dto.userId);
    if (!user) throw new NotFoundException('User not found');

    const tokens = await this.authService.getTokens(
      user.id,
      user.email ?? '',
      school.id,
    );

    const hashedRt = await this.authService.hashData(tokens.refresh_token);
    await this.userService.updateHashedRt(user.id, hashedRt);

    return { school, tokens };
  }

  async findByUserId(userId: string) {
    const school = await this.prisma.school.findUnique({
      where: { userId: userId },
    });
    if (!school) throw new NotFoundException('School not found');
    return school;
  }

  async findById(id: string) {
    const school = await this.prisma.school.findUnique({ where: { id } });
    if (!school) throw new NotFoundException('School not found');
    return school;
  }

  async getAcademicContext(schoolId: string) {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
    });

    if (!school?.currentSessionId || !school?.currentTermId) {
      throw new ConflictException(
        'School academic context (session or term) is not configured.',
      );
    }

    return {
      session: school.currentSessionId,
      term: school.currentTermId,
    };
  };

  async update(id: string, dto: UpdateSchoolDto) {
    await this.findById(id);
    return this.prisma.school.update({
      where: { id },
      data: {
        ...dto,
        dateOfInception: dto.dateOfInception
          ? new Date(dto.dateOfInception)
          : undefined,
      },
    });
  };
};
