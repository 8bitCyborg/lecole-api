import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

// delay.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DelayMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    await new Promise((resolve) => setTimeout(resolve, 500)); // 1000ms = 1 second
    next();
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(new DelayMiddleware().use);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
