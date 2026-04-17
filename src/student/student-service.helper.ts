import { ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import * as bcrypt from 'bcrypt';
import { StudentStatus } from '@prisma/client';

export const STUDENT_INCLUDE = {
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
  class: true,
  arm: true,
};

export class StudentServiceHelper {
  constructor(private prisma: PrismaService) { }

  async createUserAndEnrollment(schoolId: string, dto: CreateStudentDto) {
    const defaultPassword = dto.password || 'LecoleStudent@123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          password: hashedPassword,
          role: 'STUDENT',
        },
      });

      return this.createStudentEnrollment(tx, user.id, schoolId, dto);
    });
  }

  async createStudentEnrollment(db: any, userId: string, schoolId: string, dto: CreateStudentDto) {
    return db.student.create({
      data: {
        userId,
        schoolId,
        classId: dto.classId,
        armId: dto.armId,
        admissionNumber: dto.admissionNumber,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : null,
        guardianPhone: dto.guardianPhone,
        guardianEmail: dto.guardianEmail,
        gender: dto.gender,
        status: dto.status || StudentStatus.ACTIVE,
        isFeesPaid: dto.isFeesPaid || false,
      },
      include: STUDENT_INCLUDE,
    });
  }

  async findPaginatedByStatus(
    schoolId: string,
    status: StudentStatus,
    page: number,
    limit: number
  ) {
    const skip = (page - 1) * limit;
    const whereCondition = { schoolId, status };

    const [data, total] = await Promise.all([
      this.prisma.student.findMany({
        where: whereCondition,
        skip,
        take: limit,
        include: STUDENT_INCLUDE,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.student.count({ where: whereCondition }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findExistingUser(email?: string) {
    if (!email) return null;
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async checkExistingEnrollment(userId: string, schoolId: string) {
    const enrollment = await this.prisma.student.findUnique({
      where: {
        userId_schoolId: { userId, schoolId },
      },
    });

    if (enrollment) {
      throw new ConflictException('This user is already enrolled as a student in this school');
    }
  }
}
