import { ConfigService } from '@nestjs/config';

export const getJwtConfig = (configService: ConfigService) => ({
  jwtSecret: configService.get<string>('JWT_SECRET'),
  jwtExpiresIn: configService.get<string>('JWT_EXPIRES_IN'),
}); 

export const getDatabaseConfig = (configService: ConfigService) => ({
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
});