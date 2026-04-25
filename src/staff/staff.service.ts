import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStaffDto } from './dto/createStaff.dto';
import * as bcrypt from 'bcrypt';
import { MembershipRole, MembershipStatus } from '@prisma/client';

@Injectable()
export class StaffService {
  constructor(private prisma: PrismaService) { }

  async createStaff(dto: CreateStaffDto, schoolId: string) {
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          ...(dto.email ? [{ email: dto.email }] : []),
          { phone: dto.phone },
        ],
      },
    });

    if (existingUser) {
      const staffExists = await this.prisma.staff.findFirst({
        where: { userId: existingUser.id, schoolId },
      });

      if (staffExists) {
        throw new ConflictException('This user is already registered as staff in this school');
      }

      return this.prisma.$transaction(async (tx) => {
        const staff = await tx.staff.create({
          data: {
            userId: existingUser.id,
            schoolId,
            staffId: dto.staffId || null,
            bio: dto.bio,
            title: dto.title,
            gender: dto.gender,
            designation: dto.designation || 'Teacher',
            isTeachingStaff: dto.isTeachingStaff || false,
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

        // create the staff membership.
        await tx.membership.create({
          data: {
            userId: existingUser.id,
            schoolId,
            role: MembershipRole.STAFF,
            status: MembershipStatus.ACTIVE,
            staffId: staff.id,
          },
        });

        return staff;
      });
    }

    const defaultPassword = dto.password || 'Lecole@123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          phone: dto.phone,
          password: hashedPassword,
        },
      });

      const staff = await tx.staff.create({
        data: {
          userId: user.id,
          schoolId,
          staffId: dto.staffId || null,
          bio: dto.bio,
          title: dto.title,
          gender: dto.gender,
          designation: dto.designation || 'Teacher',
          isTeachingStaff: dto.isTeachingStaff || false,
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
      // create the staff membership.
      await tx.membership.create({
        data: {
          userId: user.id,
          schoolId,
          role: MembershipRole.STAFF,
          status: MembershipStatus.ACTIVE,
          staffId: staff.id,
        },
      });

      return staff;
    });
  }

  async findBySchool(schoolId: string) {
    return this.prisma.staff.findMany({
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
  };

  async getStaff(id: string) {
    const staff = await this.prisma.staff.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            createdAt: true,
          },
        },
        subjects: true,
        arms: { include: { class: true } },
      },
    });

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    return staff;
  }

  async deleteStaff(id: string) {
    const staff = await this.prisma.staff.findUnique({
      where: { id },
    });

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    // Deleting the user will cascade delete the staff record
    return this.prisma.user.delete({
      where: { id: staff.userId },
    });
  }

  async updateStaff(id: string, data: Partial<CreateStaffDto>) {
    const staff = await this.prisma.staff.findUnique({
      where: { id },
    });

    if (!staff) {
      throw new NotFoundException('Staff not found');
    }

    return this.prisma.staff.update({
      where: { id },
      data,
    });
  }

  async assignSubjects(id: string, subjectIds: string[]) {
    // We use Prisma's 'set' to replace the existing subjects with the new list
    return this.prisma.staff.update({
      where: { id },
      data: {
        subjects: {
          set: subjectIds.map((sid) => ({ id: sid })),
        },
      },
      include: {
        subjects: true,
      },
    });
  }
}
