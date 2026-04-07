import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { StudentStatus } from '@prisma/client';
import { StudentServiceHelper, STUDENT_INCLUDE } from './student-service.helper';

@Injectable()
export class StudentService {
  private helper: StudentServiceHelper;

  constructor(private prisma: PrismaService) {
    this.helper = new StudentServiceHelper(this.prisma);
  };

  async createStudent(dto: CreateStudentDto, schoolId: string) {
    const existingUser = await this.helper.findExistingUser(dto.email);

    if (existingUser) {
      await this.helper.checkExistingEnrollment(existingUser.id, schoolId);
      return this.helper.createStudentEnrollment(this.prisma, existingUser.id, schoolId, dto);
    }

    return this.helper.createUserAndEnrollment(schoolId, dto);
  };

  async findBySchool(schoolId: string, page: number = 1, limit: number = 10) {
    return this.helper.findPaginatedByStatus(schoolId, StudentStatus.ACTIVE, page, limit);
  };

  async findArchivedBySchool(schoolId: string, page: number = 1, limit: number = 10) {
    return this.helper.findPaginatedByStatus(schoolId, StudentStatus.WITHDRAWN, page, limit);
  };

  async findGraduatedBySchool(schoolId: string, page: number = 1, limit: number = 10) {
    return this.helper.findPaginatedByStatus(schoolId, StudentStatus.GRADUATED, page, limit);
  };

  async getStudent(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        ...STUDENT_INCLUDE,
        class: {
          include: {
            subjects: true,
          },
        },
        user: {
          select: {
            ...STUDENT_INCLUDE.user.select,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  };

  async updateStudent(id: string, dto: Partial<CreateStudentDto>) {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const { firstName, lastName, email, ...studentData } = dto;

    return this.prisma.$transaction(async (tx) => {
      // Update User if needed
      if (firstName || lastName || email) {
        await tx.user.update({
          where: { id: student.userId },
          data: { firstName, lastName, email },
        });
      }

      // Update Student
      return tx.student.update({
        where: { id },
        data: {
          ...studentData,
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        },
        include: STUDENT_INCLUDE,
      });
    });
  };

  async withdrawStudent(id: string) {
    const student = await this.prisma.student.findUnique({
      where: { id },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Change status to WITHDRAWN and keep schoolId intact
    return this.prisma.student.update({
      where: { id },
      data: {
        status: StudentStatus.WITHDRAWN,
        classId: null,
        armId: null,
      },
    });
  };

};
