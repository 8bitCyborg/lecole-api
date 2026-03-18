import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AtGuard } from './auth/common/guards/at.guard';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { SchoolModule } from './school/school.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, SchoolModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule { }