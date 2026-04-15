import { Injectable, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SchoolService } from 'src/school/school.service';
import { CreateGradingModuleDto } from './dto/create-grading-module.dto';
import { UpdateGradingModuleDto } from './dto/update-grading-module.dto';
import { BatchUpsertGradeDto } from './dto/batch-upsert-grade.dto';

@Injectable()
export class GradingService {
  constructor(
    private prisma: PrismaService,
    private schoolService: SchoolService
  ) { }

  async create(dto: CreateGradingModuleDto & { schoolId: string }) {
    const { session, term } = await this.schoolService.getAcademicContext(dto.schoolId);

    // Optional: Check for duplicate names in the same session/term/school
    const existing = await this.prisma.gradingModule.findFirst({
      where: {
        schoolId: dto.schoolId,
        sessionId: session,
        termId: term,
        name: dto.name,
        // subjectId: dto.subjectId
      }
    });

    if (existing) {
      throw new ConflictException(`A "${dto.name}" grading module already exists for this term.`);
    };

    return this.prisma.gradingModule.create({
      data: {
        ...dto,
        sessionId: session,
        termId: term,
      },
    });
  };

  async findAll(schoolId: string, session?: string, term?: string) {
    return this.prisma.gradingModule.findMany({
      where: {
        schoolId,
        ...(session && { sessionId: session }),
        ...(term && { termId: term }),
      },
      orderBy: { sequence: 'asc' },
    });
  };

  async findOne(id: string) {
    const module = await this.prisma.gradingModule.findUnique({
      where: { id },
    });
    if (!module) {
      throw new NotFoundException(`Grading module not found`);
    }
    return module;
  };

  async update(id: string, dto: UpdateGradingModuleDto) {
    const module = await this.findOne(id);

    // if (module.isLocked) {
    //   throw new ForbiddenException('This grading module is locked and cannot be updated.');
    // }

    return this.prisma.gradingModule.update({
      where: { id },
      data: dto,
    });
  };

  async remove(id: string) {
    const module = await this.findOne(id);

    if (module.isLocked) {
      throw new ForbiddenException('This grading module is locked and cannot be deleted.');
    }

    return this.prisma.gradingModule.delete({
      where: { id },
    });
  };

  async toggleLock(schoolId: string, ids: string[], lock: boolean) {
    return this.prisma.gradingModule.updateMany({
      where: {
        id: { in: ids },
        schoolId,
      },
      data: {
        isLocked: lock,
      },
    });
  };

  async findGradesByArm(schoolId: string, armId: string) {
    const { session, term } = await this.schoolService.getAcademicContext(schoolId);
    return this.prisma.grade.findMany({
      where: {
        schoolId,
        armId,
        sessionId: session,
        termId: term,
      },
    });
  }

  async batchUpsert(schoolId: string, dto: BatchUpsertGradeDto) {
    const { context, scores } = dto;

    // Enrollment Validation: Ensure all students belong to the arm and school
    const studentIds = scores.map(s => s.studentId);
    const enrolledStudents = await this.prisma.student.findMany({
      where: {
        id: { in: studentIds },
        schoolId,
        armId: context.armId,
      },
      select: { id: true },
    });

    const enrolledIds = new Set(enrolledStudents.map(s => s.id));
    const invalidIds = studentIds.filter(id => !enrolledIds.has(id));

    if (invalidIds.length > 0) {
      throw new ForbiddenException(`The following students are not enrolled in this arm: ${invalidIds.join(', ')}`);
    }

    // Perform Upserts in a transaction for atomicity
    const operations = scores.map(item =>
      this.prisma.grade.upsert({
        where: {
          studentId_subjectId_gradingModuleId_termId_sessionId: {
            studentId: item.studentId,
            subjectId: item.subjectId,
            gradingModuleId: item.gradingModuleId,
            termId: context.term,
            sessionId: context.session,
          },
        },
        update: {
          score: item.score,
          updatedAt: new Date(),
        },
        create: {
          score: item.score,
          studentId: item.studentId,
          subjectId: item.subjectId,
          gradingModuleId: item.gradingModuleId,
          classId: context.classId,
          armId: context.armId,
          termId: context.term,
          sessionId: context.session,
          schoolId: schoolId,
        },
      })
    );

    await this.prisma.$transaction(operations);

    return { count: scores.length };
  }

  async findGradesByStudent(schoolId: string, studentId: string, term?, session?) {
    return this.prisma.grade.findMany({
      where: {
        schoolId,
        studentId,
        ...(term && { term }),
        ...(session && { session }),
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
          }
        },
      },
    });
  };

};