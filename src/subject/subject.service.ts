import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubjectDto } from './dto/subject.dto';

@Injectable()
export class SubjectService {
  constructor(private prisma: PrismaService) { }

  async findAll(schoolId: string) {
    const subjects = await this.prisma.subject.findMany({
      where: { schoolId },
      include: {
        _count: {
          select: {
            classes: true,
            staff: true,
          }
        }
      }
    });
    return subjects;
  };

  async createSubject(dto: CreateSubjectDto) {
    const existing = await this.prisma.subject.findFirst({
      where: {
        name: dto.name,
        schoolId: dto.schoolId,
      },
    });
    if (existing) {
      throw new ConflictException('A subject with this name already exists');
    };

    return this.prisma.subject.create({
      data: dto,
    });
  };

  async deleteSubject(id: string, schoolId: string) {
    return this.prisma.subject.delete({
      where: { id, schoolId },
    });
  };

  async findOne(id: string, schoolId: string) {
    const subject = await this.prisma.subject.findUnique({
      where: { id, schoolId },
      include: {
        classes: {
          select: {
            id: true,
            name: true,
          }
        },
        _count: {
          select: {
            classes: true,
            staff: true,
          }
        },
        staff: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              }
            }
          }
        }
      }
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return subject;
  };

  async assignClasses(id: string, schoolId: string, classIds: string[]) {
    return this.prisma.subject.update({
      where: { id, schoolId },
      data: {
        classes: {
          set: classIds.map(classId => ({ id: classId }))
        }
      },
      include: {
        classes: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });
  };

  async assignTeachers(id: string, schoolId: string, staffIds: string[]) {
    return this.prisma.subject.update({
      where: { id, schoolId },
      data: {
        staff: {
          set: staffIds.map(staffId => ({ id: staffId }))
        }
      },
      include: {
        staff: {
          select: {
            id: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      }
    });
  };

};
