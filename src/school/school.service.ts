import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSchoolDto, UpdateSchoolDto } from './dto/school.dto';
import { CreateAcademicSessionDto } from './dto/academicSession.dto';
import { CreateTermDto } from './dto/term.dto';



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

  // Academic Sessions
  async createSession(schoolId: string, dto: CreateAcademicSessionDto) {
    const existing = await this.prisma.academicSession.findFirst({
      where: {
        schoolId,
        identifier: dto.identifier,
      },
    });

    if (existing) {
      throw new ConflictException('Academic session with this identifier already exists for this school');
    }

    return this.prisma.$transaction(async (tx) => {
      const session = await tx.academicSession.create({
        data: {
          identifier: dto.identifier,
          schoolId,
          startDate: dto.startDate ? new Date(dto.startDate) : null,
          endDate: dto.endDate ? new Date(dto.endDate) : null,
        },
      });

      let currentTermId: string | null = null;

      if (dto.term) {
        const term = await tx.term.create({
          data: {
            identifier: dto.term.identifier,
            startDate: new Date(dto.term.startDate),
            endDate: dto.term.endDate ? new Date(dto.term.endDate) : null,
            numberOfWeeks: dto.term.numberOfWeeks,
            academicSessionId: session.id,
            schoolId,
          },
        });
        currentTermId = term.id;
      }

      await tx.school.update({
        where: { id: schoolId },
        data: {
          currentSessionId: session.id,
          ...(currentTermId ? { currentTermId } : {}),
        },
      });

      return tx.academicSession.findUnique({
        where: { id: session.id },
        include: {
          terms: true,
        },
      });
    });
  }

  async findAllSessions(schoolId: string) {
    return this.prisma.academicSession.findMany({
      where: { schoolId },
      include: {
        terms: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  async findSessionById(id: string) {
    const session = await this.prisma.academicSession.findUnique({
      where: { id },
      include: {
        terms: true,
      },
    });
    if (!session) throw new NotFoundException('Academic session not found');
    return session;
  }

  // Terms
  async createTerm(schoolId: string, dto: CreateTermDto) {
    const term = await this.prisma.term.create({
      data: {
        ...dto,
        schoolId,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
    });

    await this.prisma.school.update({
      where: { id: schoolId },
      data: { currentTermId: term.id },
    });

    return term;
  }

  async findAllTerms(schoolId: string, sessionId?: string) {
    return this.prisma.term.findMany({
      where: {
        schoolId,
        ...(sessionId ? { academicSessionId: sessionId } : {}),
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }
};


