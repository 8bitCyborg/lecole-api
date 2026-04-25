import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from '../auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async createUser(dto: Omit<AuthDto, 'password'> & { hashedPassword: string }) {
    return this.prisma.user.create({
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        password: dto.hashedPassword,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async getUserProfile(userId: string, schoolId: string) {
    const memberships = await this.prisma.membership.findMany({
      where: { userId },
      include: { school: true },
    });

    const currentMembership = await this.prisma.membership.findUnique({
      where: {
        userId_schoolId: { userId, schoolId },
      },
      include: {
        staff: true,
        student: true,
      },
    });

    return {
      memberships,
      profile: currentMembership?.staff || currentMembership?.student || null,
    };
  };

  async updateHashedRt(userId: string, hashedRt: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { hashedRt },
    });
  }

  async clearHashedRt(userId: string) {
    return this.prisma.user.updateMany({
      where: {
        id: userId,
        hashedRt: { not: null },
      },
      data: { hashedRt: null },
    });
  }
}
