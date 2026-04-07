import {
  Injectable,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClassDto } from './dto/createClass.dto';

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) { }

  async findAll(schoolId: string) {
    return this.prisma.class.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
      include: {
        subjects: {
          select: { id: true, name: true },
        },
        _count: {
          select: {
            arms: true,
            subjects: true,
          },
        },
      },
    });
  };

  async createClass(dto: CreateClassDto) {
    const existing = await this.prisma.class.findFirst({
      where: {
        OR: [{ name: dto.name }],
      },
    });
    if (existing) {
      throw new ConflictException(
        'A class with this name or school already exists',
      );
    };

    return this.prisma.class.create({
      data: dto,
    });
  };

  async deleteClass(id: string, schoolId: string) {
    return this.prisma.class.delete({
      where: { id, schoolId },
    });
  };

  async assignSubjects(classId: string, schoolId: string, subjectIds: string[]) {
    const cls = await this.prisma.class.findUnique({
      where: { id: classId },
    });

    if (!cls || cls.schoolId !== schoolId) {
      throw new NotFoundException('Class not found');
    }

    return this.prisma.class.update({
      where: { id: classId },
      data: {
        subjects: {
          set: subjectIds.map((id) => ({ id })),
        },
      },
      include: {
        subjects: {
          select: { id: true, name: true },
        },
      },
    });
  }
};
