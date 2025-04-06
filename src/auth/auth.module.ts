import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthUtilsService } from './authUtils/auth.utils';
import { Users } from 'src/users/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { authConstants } from './authUtils/constants';
@Module({
  imports: [JwtModule.register({
    global: true,
    secret: authConstants.jwtSecret,
    signOptions: { expiresIn: authConstants.jwtExpiresIn },
  })],
  providers: [AuthService, AuthUtilsService],
  controllers: [AuthController]
})
export class AuthModule {}
