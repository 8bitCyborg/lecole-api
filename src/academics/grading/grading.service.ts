import { Injectable, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SchoolService } from 'src/school/school.service';
import { CreateGradingModuleDto } from './dto/create-grading-module.dto';
import { UpdateGradingModuleDto } from './dto/update-grading-module.dto';

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
        session,
        term,
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
        session,
        term,
      },
    });
  };

  async findAll(schoolId: string, session?: string, term?: string) {
    return this.prisma.gradingModule.findMany({
      where: {
        schoolId,
        ...(session && { session }),
        ...(term && { term }),
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

    if (module.isLocked) {
      throw new ForbiddenException('This grading module is locked and cannot be updated.');
    }

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
  }
};