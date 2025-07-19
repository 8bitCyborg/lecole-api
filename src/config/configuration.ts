import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { config } from 'rxjs';
import { Students } from 'src/students/entity/student.entity';
import { Users } from 'src/users/entity/user.entity';

export const getJwtConfig = (configService: ConfigService) => ({
  jwtSecret: configService.get<string>('JWT_SECRET'),
  jwtExpiresIn: configService.get<string>('JWT_EXPIRES_IN'),
});

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mongodb',
  url: configService.get<string>('DB_CONNECTION_URL'),
  // entities: [Students],
  // entities: [Students, Users],
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  synchronize: true,
  // configService.get<string>('APP_ENV') === 'development' ? true : false,
});

export const getOpenRouterConfig = ( configService: ConfigService ) => ({
  openRouterSecretKey: configService.get<string>('OPEN_ROUTER_SECRET'),
});