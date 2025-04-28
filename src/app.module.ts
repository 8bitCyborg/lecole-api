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
import { DataSource } from 'typeorm';
import { join } from 'path';
import { Students } from './students/entity/student.entity';
import { Users } from './users/entity/user.entity';
import { Payment } from './payments/entities/payment.entity';
import { School } from './schools/entities/school.entity';
import { Session } from './sessions/entity/session.entity';
import { Staff } from './staff/entities/staff.entity';

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
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://localhost:27017/lecole',
      entities: [Payment, Students, Users, School, Session, Staff],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    StudentsModule,
    SessionsModule,
    TermsModule,
    StaffModule,
    SchoolsModule,
    PaymentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
