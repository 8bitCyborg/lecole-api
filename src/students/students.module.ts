import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schemas/student.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import {
  AssessmentRecord,
  AssessmentRecordSchema,
} from '../assessment-records/schemas/assessment-records.schema';
import { Class, ClassSchema } from '../classes/schemas/classes.schema';
import { AuthUtilsService } from '../auth/authUtils/auth.utils';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '../config/configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: User.name, schema: UserSchema },
      { name: AssessmentRecord.name, schema: AssessmentRecordSchema },
      { name: Class.name, schema: ClassSchema },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // const config = getJwtConfig(configService);
        return {
          // secret: config.jwtSecret,
          // signOptions: {
          //   expiresIn: config.jwtExpiresIn as any,
          // },
          secret:
            configService.get<string>('JWT_SECRET') || 'acdb-secret-key-2024',
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '7d',
          },
          global: true,
        };
      },
      // imports: [ConfigModule],
      // useFactory: async (configService: ConfigService) => ({
      //   secret:
      //     configService.get<string>('JWT_SECRET') || 'default-secret-change-me',
      //   signOptions: {
      //     expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '7d',
      //   },
      // }),
      inject: [ConfigService],
    }),
  ],
  controllers: [StudentsController],
  providers: [StudentsService, AuthUtilsService],
})
export class StudentsModule {}
