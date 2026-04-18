import {
  Injectable,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClassDto, CreateBulkClassesDto } from './dto/createClass.dto';

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

  async findClass(classId: string, schoolId: string) {
    return this.prisma.class.findUnique({
      where: { id: classId, schoolId },
      include: {
        subjects: {
          select: { id: true, name: true }
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
        schoolId: dto.schoolId,
        name: dto.name,
      },
    });
    if (existing) {
      throw new ConflictException(
        'A class with this name already exists in this school',
      );
    };

    return this.prisma.class.create({
      data: dto,
    });
  };

  async createBulkClasses(dto: CreateBulkClassesDto) {
    const { classes, schoolId } = dto;

    const names = classes.map(c => c.name);
    const existingClasses = await this.prisma.class.findMany({
      where: {
        schoolId,
        name: { in: names },
      },
      select: { name: true },
    });

    const existingNames = new Set(existingClasses.map(c => c.name));
    const newClasses = classes.filter(c => !existingNames.has(c.name));

    if (newClasses.length === 0) {
      throw new ConflictException('All provided classes already exist');
    }

    return this.prisma.class.createMany({
      data: newClasses.map(c => ({
        ...c,
        schoolId,
      })),
      skipDuplicates: true,
    });
  }

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
