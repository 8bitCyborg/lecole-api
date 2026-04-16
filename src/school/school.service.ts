import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSchoolDto, UpdateSchoolDto } from './dto/school.dto';
import { CreateAcademicSessionDto } from './dto/academicSession.dto';
import { CreateTermDto, UpdateTermDto } from './dto/term.dto';



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




  // Academic Session Methods.
  async createSession(schoolId: string, dto: CreateAcademicSessionDto) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.academicSession.findUnique({
        where: {
          schoolId_identifier: {
            schoolId,
            identifier: dto.identifier,
          },
        },
      });

      if (existing) {
        throw new ConflictException('Academic session already exists');
      }

      const session = await tx.academicSession.create({
        data: {
          identifier: dto.identifier,
          schoolId: schoolId,
          termsPerSession: dto.termsPerSession,
        },
      });

      const school = await tx.school.findUnique({
        where: { id: schoolId },
      });

      if (!school?.currentSessionId) {
        await tx.school.update({
          where: { id: schoolId },
          data: {
            currentSessionId: session.id,
          },
        });
      }

      return session;
    });
  }

  async updateSession(schoolId: string, sessionId: string, dto: import('./dto/academicSession.dto').UpdateAcademicSessionDto) {
    const session = await this.prisma.academicSession.findUnique({
      where: { id: sessionId, schoolId },
      include: { terms: true }
    });

    if (!session) {
      throw new NotFoundException('Academic session not found');
    }

    if (dto.termsPerSession && dto.termsPerSession < session.terms.length) {
      throw new ConflictException('Cannot set terms per session lower than the number of existing terms');
    }

    if (dto.identifier && dto.identifier !== session.identifier) {
      const existing = await this.prisma.academicSession.findUnique({
        where: {
          schoolId_identifier: {
            schoolId,
            identifier: dto.identifier,
          },
        },
      });

      if (existing) {
        throw new ConflictException('Academic session with this identifier already exists');
      }
    }

    return this.prisma.academicSession.update({
      where: { id: sessionId },
      data: {
        ...(dto.identifier ? { identifier: dto.identifier } : {}),
        ...(dto.termsPerSession ? { termsPerSession: dto.termsPerSession } : {}),
      },
    });
  }

  async endSession(schoolId: string, sessionId: string) {
    return this.prisma.$transaction(async (tx) => {
      const session = await tx.academicSession.findUnique({
        where: { id: sessionId, schoolId },
        include: { terms: { where: { status: 'active' } } }
      });

      if (!session) throw new NotFoundException('Academic session not found');
      // if (session.status !== 'active') throw new ConflictException('Session is already concluded or not active');

      // Conclude the session
      const updatedSession = await tx.academicSession.update({
        where: { id: sessionId },
        data: { status: 'concluded' },
      });

      // Also conclude any active terms in this session if they exist
      if (session.terms.length > 0) {
        await tx.term.updateMany({
          where: { academicSessionId: sessionId, status: 'active' },
          data: { status: 'concluded' },
        });
      }

      // Clear the school's current academic context
      await tx.school.update({
        where: { id: schoolId },
        data: {
          currentSessionId: null,
          currentTermId: null,
        },
      });

      return updatedSession;
    });
  };


  async getSessions(schoolId: string) {
    return this.prisma.academicSession.findMany({
      where: { schoolId },
      include: {
        terms: {
          orderBy: { startDate: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCurrentSession(schoolId: string) {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
      include: {
        currentSession: {
          include: {
            terms: {
              orderBy: { startDate: 'asc' },
            },
          },
        },
      },
    });

    return school?.currentSession ?? null;
  }

  // Term Methods
  async createTerm(schoolId: string, dto: CreateTermDto) {
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.term.findUnique({
        where: {
          academicSessionId_identifier: {
            academicSessionId: dto.academicSessionId,
            identifier: dto.identifier,
          },
        },
      });

      if (existing) {
        throw new ConflictException('A term with this identifier already exists in this session');
      }

      const term = await tx.term.create({
        data: {
          identifier: dto.identifier,
          academicSessionId: dto.academicSessionId,
          schoolId: schoolId,
          startDate: new Date(dto.startDate),
          endDate: dto.endDate ? new Date(dto.endDate) : undefined,
          numberOfWeeks: dto.numberOfWeeks,
        },
      });

      const school = await tx.school.findUnique({
        where: { id: schoolId },
      });

      if (!school?.currentTermId) {
        await tx.school.update({
          where: { id: schoolId },
          data: {
            currentTermId: term.id,
          },
        });
      }

      return term;
    });
  }

  async updateTerm(schoolId: string, termId: string, dto: UpdateTermDto) {
    const term = await this.prisma.term.findUnique({
      where: { id: termId, schoolId },
    });
    if (!term) throw new NotFoundException('Term not found');

    if (dto.identifier && dto.identifier !== term.identifier) {
      if (!term.academicSessionId) throw new ConflictException('Term does not belong to any session');

      const existing = await this.prisma.term.findUnique({
        where: {
          academicSessionId_identifier: {
            academicSessionId: term.academicSessionId,
            identifier: dto.identifier,
          },
        },
      });

      if (existing) throw new ConflictException('A term with this identifier already exists in this session');
    };

    return this.prisma.term.update({
      where: { id: termId },
      data: {
        ...(dto.identifier ? { identifier: dto.identifier } : {}),
        ...(dto.startDate ? { startDate: new Date(dto.startDate) } : {}),
        ...(dto.numberOfWeeks !== undefined ? { numberOfWeeks: dto.numberOfWeeks } : {}),
      },
    });
  }

  async endTerm(schoolId: string, termId: string) {
    return this.prisma.$transaction(async (tx) => {
      const term = await tx.term.findUnique({
        where: { id: termId, schoolId },
      });

      if (!term) throw new NotFoundException('Term not found');
      if (term.status !== 'active') throw new ConflictException('Term is not active');

      const updatedTerm = await tx.term.update({
        where: { id: termId },
        data: { status: 'concluded' },
      });

      await tx.school.update({
        where: { id: schoolId },
        data: { currentTermId: null },
      });

      return updatedTerm;
    });
  }
};
