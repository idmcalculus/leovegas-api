import { NestFactory } from '@nestjs/core';
import * as crypto from 'crypto';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { JsonWebTokenExceptionFilter } from './filters/jsonwebtoken_exception.filter';
import { AllExceptionsFilter } from './filters/all_exceptions.filter';
import { HttpExceptionFilter } from './filters/http_exceptions.filter';
import { PrismaExceptionFilter } from './filters/prisma_exceptions.filter';
import { ValidationExceptionFilter } from './filters/validation_exceptions.filter';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet()); // for security
  app.enableCors();

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('User API')
    .setDescription(
      'A Simple RESTful API that can be used to create, read, update, and delete users.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new JsonWebTokenExceptionFilter());
  app.useGlobalFilters(new PrismaExceptionFilter());
  app.useGlobalFilters(new ValidationExceptionFilter());

  app.use((req: Request, res: Response, next: NextFunction) => {
    const nonce = crypto.randomBytes(16).toString('base64');
    res.setHeader(
      'Content-Security-Policy',
      `script-src 'self' 'nonce-${nonce}'`,
    );
    res.locals.nonce = nonce;
    next();
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
