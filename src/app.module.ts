import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AtGuard } from './auth/common/guards/at.guard';
import { APP_GUARD } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { SchoolModule } from './school/school.module';
import { ClassModule } from './class/class.module';
import { SubjectModule } from './subject/subject.module';
import { StaffModule } from './staff/staff.module';
import { StudentModule } from './student/student.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    SchoolModule,
    ClassModule,
    SubjectModule,
    StaffModule,
    StudentModule
  ],
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