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
    });
  };

  async create(dto: CreateClassDto) {
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
  }

};

