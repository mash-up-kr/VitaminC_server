import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import cookieParser from 'cookie-parser';

import { CustomExceptionFilter } from 'src/core/exception-filters/custom-exception.filter';
import { ResponseInterceptor } from 'src/core/intercepters/response.intercepter';

import { AppModule } from './app.module';
import { CustomExceptionFilter } from './core/exception-filters/custom-exception.filter';
import { UtilService } from './util/util.service';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  Sentry.init({
    dsn: 'https://d3012af412384e4e0387dc84839e5eee@o4507516567945216.ingest.us.sentry.io/4507516570697728',
    integrations: [nodeProfilingIntegration()],

    tracesSampleRate: 1.0,

    profilesSampleRate: 1.0,
  });

  const configService = app.select(AppModule).get(ConfigService);
  const utilService = new UtilService(configService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new CustomExceptionFilter(configService, utilService));

  const config = new DocumentBuilder()
    .setTitle('Korrk API')
    .setDescription('Mashup의 VitaminC팀 API 서버입니다')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = configService.get('PORT');
  app.enableCors({ origin: '*', credentials: true });
  app.use(cookieParser());
  await app.listen(port);

  console.log(`Application is running: http://localhost:${port}/api-docs`);
}
bootstrap();
