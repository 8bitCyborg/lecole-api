import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSchoolDto, UpdateSchoolDto } from './dto/school.dto';

@Injectable()
export class SchoolService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateSchoolDto) {
    const existing = await this.prisma.school.findFirst({
      where: {
        OR: [{ name: dto.name }, { email: dto.email }, { user_id: dto.user_id }],
      },
    });
    if (existing) {
      throw new ConflictException(
        'A school with this name, email, or user already exists',
      );
    }

    return this.prisma.school.create({
      data: {
        ...dto,
        date_of_inception: dto.date_of_inception
          ? new Date(dto.date_of_inception)
          : undefined,
      },
    });
  }

  async findByUserId(userId: string) {
    const school = await this.prisma.school.findUnique({
      where: { user_id: userId },
    });
    if (!school) throw new NotFoundException('School not found');
    return school;
  }

  private async _findById(id: string) {
    const school = await this.prisma.school.findUnique({ where: { id } });
    if (!school) throw new NotFoundException('School not found');
    return school;
  }

  async update(id: string, dto: UpdateSchoolDto) {
    await this._findById(id);
    return this.prisma.school.update({
      where: { id },
      data: {
        ...dto,
        date_of_inception: dto.date_of_inception
          ? new Date(dto.date_of_inception)
          : undefined,
      },
    });
  }
}
