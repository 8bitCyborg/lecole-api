import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:
      process.env.APP_ENV === 'prod'
        ? 'https://lecole.app'
        : ['http://localhost:5173', 'https://lecole-web.netlify.app'],
    credentials: true,
  });
  app.use(cookieParser() as any);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
