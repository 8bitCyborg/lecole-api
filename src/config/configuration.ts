import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

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

// export const getJwtConfig = (configService: ConfigService) => ({
//   jwtSecret: configService.getOrThrow<string>('JWT_SECRET'),
//   jwtExpiresIn: configService.getOrThrow<string>('JWT_EXPIRES_IN'),
// });

// export const getDatabaseConfig = (
//   configService: ConfigService,
// ): TypeOrmModuleOptions => ({
//   type: 'mongodb',
//   url: configService.getOrThrow<string>('DB_CONNECTION_URL'),
//   entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
//   synchronize: true,
// });
