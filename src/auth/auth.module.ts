import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthUtilsService } from './authUtils/auth.utils';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getJwtConfig } from '../config/configuration';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './authUtils/auth.guard';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { School, SchoolSchema } from 'src/schools/schemas/school.schema';
import { Class, ClassSchema } from 'src/classes/schemas/classes.schema';
import { SchoolsService } from 'src/schools/schools.service';
import { Term, TermSchema } from 'src/terms/schemas/term.schema';
import {
  AssessmentRecord,
  AssessmentRecordSchema,
} from 'src/assessment-records/schemas/assessment-records.schema';
import { Subject, SubjectSchema } from 'src/subjects/schemas/subject.schema';
import { Student, StudentSchema } from 'src/students/schemas/student.schema';
import { ClassArm, ClassArmSchema } from 'src/classes/schemas/class-arm.schema';
@Module({
  imports: [
    // TypeOrmModule.forFeature([Users]),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: School.name, schema: SchoolSchema },
      { name: Class.name, schema: ClassSchema },
      { name: Term.name, schema: TermSchema },
      { name: AssessmentRecord.name, schema: AssessmentRecordSchema },
      { name: Subject.name, schema: SubjectSchema },
      { name: Student.name, schema: StudentSchema },
      { name: ClassArm.name, schema: ClassArmSchema },
    ]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const config = getJwtConfig(configService);
        return {
          secret: config.jwtSecret,
          signOptions: {
            expiresIn: config.jwtExpiresIn,
          },
          global: true,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  providers: [
    AuthService,
    SchoolsService,
    AuthUtilsService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
