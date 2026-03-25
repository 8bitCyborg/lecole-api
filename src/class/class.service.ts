import {
  Injectable,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClassDto } from './dto/createClass.dto';
import { CreateArmDto } from './dto/createArm.dto';

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) { }

  async findAll(schoolId: string) {
    return this.prisma.class.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
      include: {
        subjects: {
          select: { name: true },
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

  async findArms(classId: string) {
    return this.prisma.arm.findMany({
      where: { classId },
    });
  };

  async createArm(dto: CreateArmDto) {
    const existing = await this.prisma.arm.findFirst({
      where: {
        name: dto.name,
        classId: dto.classId,
      },
    });

    if (existing) {
      throw new ConflictException('An arm with this name already exists in this class');
    }

    return this.prisma.arm.create({
      data: dto,
    });
  };

  async deleteArm(id: string, classId: string, schoolId: string) {
    return this.prisma.arm.delete({
      where: { id, classId, schoolId },
    });
  };

};

