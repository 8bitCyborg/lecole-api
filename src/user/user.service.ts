import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from '../auth/dto/auth.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(dto: Omit<AuthDto, 'password'> & { hashedPassword: string }) {
    return this.prisma.user.create({
      data: {
        email: dto.email,
        first_name: dto.first_name,
        last_name: dto.last_name,
        phone: dto.phone,
        role: 'ADMIN',
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
