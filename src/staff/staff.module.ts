import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Staff, StaffSchema } from './schemas/staff.schema';
import { School, SchoolSchema } from '../schools/schemas/school.schema';
import { AuthUtilsService } from '../auth/authUtils/auth.utils';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from '../config/configuration';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Staff.name, schema: StaffSchema },
      { name: User.name, schema: UserSchema },
      { name: School.name, schema: SchoolSchema },
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
  controllers: [StaffController],
  providers: [StaffService, AuthUtilsService],
})
export class StaffModule {}
