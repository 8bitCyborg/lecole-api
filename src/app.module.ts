import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { getDatabaseConfig } from './config/configuration';
import { StudentsModule } from './students/students.module';
import { SessionsModule } from './sessions/sessions.module';
import { TermsModule } from './terms/terms.module';
import { StaffModule } from './staff/staff.module';
import { SchoolsModule } from './schools/schools.module';
import { PaymentsModule } from './payments/payments.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './users/schemas/user.schema';
import { Student, StudentSchema } from './students/schemas/student.schema';
import { SubjectsModule } from './subjects/subjects.module';
import { ClassesModule } from './classes/classes.module';
import { AssessmentRecordsModule } from './assessment-records/assessment-records.module';
import { SettingsModule } from './settings/settings.module';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // TypeOrmModule.forRootAsync({
    //   useFactory: (configService: ConfigService) =>
    //     getDatabaseConfig(configService),
    //   inject: [ConfigService],
    // }),
    // TypeOrmModule.forRoot({
    //   type: 'mongodb',
    //   url: 'mongodb://localhost:27017/lecole',
    //   entities: [Payment, Students, Users, School, Session, Staff],
    //   synchronize: true,
    // }),
    MongooseModule.forRoot(`${process.env.DB_CONNECTION_URL}`),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
    AuthModule,
    UsersModule,
    StudentsModule,
    SessionsModule,
    TermsModule,
    StaffModule,
    SchoolsModule,
    PaymentsModule,
    SubjectsModule,
    ClassesModule,
    AssessmentRecordsModule,
    SettingsModule,
    ExpensesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
