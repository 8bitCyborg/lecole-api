import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SchoolService } from 'src/school/school.service';
import { BatchUpsertAttendanceDto } from './dto/batch-upsert-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    private prisma: PrismaService,
    private schoolService: SchoolService
  ) { }

  async markAttendance(schoolId: string, userId: string, dto: BatchUpsertAttendanceDto) {
    const { classId, armId, date, records } = dto;
    const { session, term } = await this.schoolService.getAcademicContext(schoolId);

    // Validate date format and parse it
    const attendanceDate = new Date(date);
    if (isNaN(attendanceDate.getTime())) {
      throw new ForbiddenException('Invalid date format provided');
    }

    // Enrollment Validation: Ensure all students belong to the arm and school
    const studentIds = records.map(s => s.studentId);
    const enrolledStudents = await this.prisma.student.findMany({
      where: {
        id: { in: studentIds },
        schoolId,
        armId,
      },
      select: { id: true },
    });

    const enrolledIds = new Set(enrolledStudents.map(s => s.id));
    const invalidIds = studentIds.filter(id => !enrolledIds.has(id));

    if (invalidIds.length > 0) {
      throw new ForbiddenException(`The following students are not enrolled in this arm: ${invalidIds.join(', ')}`);
    }

    // Perform Upserts in a transaction for atomicity
    const operations = records.map(item =>
      this.prisma.attendance.upsert({
        where: {
          studentId_date_classId: {
            studentId: item.studentId,
            date: attendanceDate,
            classId: classId,
          },
        },
        update: {
          status: item.status,
          recordedById: userId,
          updatedAt: new Date(),
        },
        create: {
          status: item.status,
          studentId: item.studentId,
          classId,
          armId,
          term,
          session,
          schoolId,
          date: attendanceDate,
          recordedById: userId,
        },
      })
    );

    await this.prisma.$transaction(operations);

    return { count: records.length };
  }

  async findAttendanceRecords(
    schoolId: string,
    classId: string,
    armId: string,
    term: string,
    session: string,
    startDate?: string,
    endDate?: string
  ) {
    const whereClause: any = {
      schoolId,
      classId,
      armId,
      term,
      session,
    };

    if (startDate || endDate) {
      whereClause.date = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          whereClause.date.gte = start;
        }
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          whereClause.date.lte = end;
        }
      }

      if (Object.keys(whereClause.date).length === 0) {
        delete whereClause.date;
      }
    }

    return this.prisma.attendance.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
    });
  }

  async findStudentRecords(studentId: string) {
    return this.prisma.attendance.findMany({
      where: { studentId },
      orderBy: { date: 'desc' },
    });
  };

  // async remove(id: string) {
  // Attempt delete directly. Prisma throws an error if it doesn't exist.
  // return this.prisma.attendance.delete({
  //   where: { id },
  // });
  // }
}
