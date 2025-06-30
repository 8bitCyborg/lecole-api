import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from './schemas/student.schema';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { AssessmentRecord, AssessmentRecordSchema } from 'src/assessment-records/schemas/assessment-records.schema';
import { Class, ClassSchema } from 'src/classes/schemas/classes.schema';
import { AuthUtilsService } from 'src/auth/authUtils/auth.utils';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from 'src/config/configuration';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: User.name, schema: UserSchema },
      { name: AssessmentRecord.name, schema: AssessmentRecordSchema },
      { name: Class.name, schema: ClassSchema },
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
  ],
  controllers: [StudentsController],
  providers: [StudentsService, AuthUtilsService],
})
export class StudentsModule {}
