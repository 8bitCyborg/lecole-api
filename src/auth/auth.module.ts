import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthUtilsService } from './authUtils/auth.utils';
import { Users } from 'src/users/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getJwtConfig } from '../config/configuration';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './authUtils/auth.guard';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
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
    AuthUtilsService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
