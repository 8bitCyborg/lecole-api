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

  async getArmsBySchool(schoolId: string) {
    return this.prisma.arm.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
      include: {
        class: {
          select: { name: true },
        },
      },
    });
  };

  async findArms(classId: string) {
    return this.prisma.arm.findMany({
      where: { classId },
      orderBy: { name: 'asc' },
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

  async updateArm(armId: string, classId: string, schoolId: string, dto: Partial<CreateArmDto>) {
    const arm = await this.prisma.arm.findUnique({
      where: { id: armId, classId, schoolId },
    });

    if (!arm) {
      throw new NotFoundException('Arm not found');
    }

    if (dto.name && dto.name !== arm.name) {
      const existing = await this.prisma.arm.findFirst({
        where: {
          name: dto.name,
          classId,
          NOT: { id: armId },
        },
      });

      if (existing) {
        throw new ConflictException('An arm with this name already exists in this class');
      }
    }

    return this.prisma.arm.update({
      where: { id: armId },
      data: {
        name: dto.name,
        capacity: dto.capacity,
      },
    });
  }

  async assignMasterToArm(armId: string, staffId: string | null, schoolId: string) {
    const arm = await this.prisma.arm.findUnique({
      where: { id: armId },
    });

    if (!arm || arm.schoolId !== schoolId) {
      throw new NotFoundException('Arm not found');
    }

    return this.prisma.arm.update({
      where: { id: armId },
      data: { classMasterId: staffId || null },
    });
  }

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

  async findStudentsByArm(armId: string, schoolId: string) {
    const arm = await this.prisma.arm.findUnique({
      where: { id: armId, schoolId },
    });

    if (!arm) {
      throw new NotFoundException('Arm not found');
    }

    return this.prisma.student.findMany({
      where: { armId, schoolId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        user: {
          firstName: 'asc',
        },
      },
    });
  }

};

