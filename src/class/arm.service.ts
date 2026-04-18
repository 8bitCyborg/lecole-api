import {
  Injectable,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArmDto, CreateBulkArmsDto } from './dto/createArm.dto';

@Injectable()
export class ArmService {
  constructor(private prisma: PrismaService) { }

  async getArmsBySchool(schoolId: string) {
    return this.prisma.arm.findMany({
      where: { schoolId },
      orderBy: { name: 'asc' },
      include: {
        class: {
          select: { name: true },
        },
        _count: {
          select: { students: true },
        },
      },
    });
  };

  async findArms(classId: string) {
    return this.prisma.arm.findMany({
      where: { classId },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { students: true },
        },
      },
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

  async createBulkArms(dto: CreateBulkArmsDto) {
    const { arms, classId, schoolId } = dto;

    const names = arms.map(a => a.name);
    const existingArms = await this.prisma.arm.findMany({
      where: {
        classId,
        name: { in: names },
      },
      select: { name: true },
    });

    const existingNames = new Set(existingArms.map(a => a.name));
    const newArms = arms.filter(a => !existingNames.has(a.name));

    if (newArms.length === 0) {
      throw new ConflictException('All provided arms already exist in this class');
    }

    return this.prisma.arm.createMany({
      data: newArms.map(a => ({
        ...a,
        classId,
        schoolId,
      })),
      skipDuplicates: true,
    });
  }

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
}
