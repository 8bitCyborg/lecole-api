import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTeacherDto } from './dto/createTeacher.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeacherService {
  constructor(private prisma: PrismaService) { }

  async createTeacher(dto: CreateTeacherDto, schoolId: string) {
    if (dto.email) {
      const userExists = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });

      if (userExists) {
        throw new ConflictException('A user with this email already exists');
      }
    }

    const phoneExists = await this.prisma.user.findFirst({
      where: { phone: dto.phone },
    });

    if (phoneExists) {
      throw new ConflictException('A user with this phone number already exists');
    }

    const defaultPassword = dto.password || 'Lecole@123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          firstName: dto.first_name,
          lastName: dto.last_name,
          phone: dto.phone,
          password: hashedPassword,
          role: 'TEACHER',
        },
      });

      const teacher = await tx.teacher.create({
        data: {
          userId: user.id,
          schoolId,
          staffId: dto.staffId || null,
          bio: dto.bio,
        },
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
          subjects: true,
        },
      });

      return teacher;
    });
  }

  async findBySchool(schoolId: string) {
    return this.prisma.teacher.findMany({
      where: { schoolId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async getTeacher(id: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            createdAt: true,
          },
        },
        subjects: true,
        arm: true,
      },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return teacher;
  }

  async deleteTeacher(id: string) {
    const teacher = await this.prisma.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    // Deleting the user will cascade delete the teacher record
    return this.prisma.user.delete({
      where: { id: teacher.userId },
    });
  }
}
