import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import cookieParser from 'cookie-parser';

import { ResponseInterceptor } from 'src/core/intercepters/response.intercepter';

import { AppModule } from './app.module';
import { NODE_ENVIRONMENT } from './common/helper/env.validation';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Korrk API')
    .setDescription('Mashup의 VitaminC팀 API 서버입니다')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const configService = app.select(AppModule).get(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port);

  app.enableCors({
    origin:
      configService.get('NOE_ENV') === NODE_ENVIRONMENT['production']
        ? 'https://korrk.kr'
        : 'http://localhost:3000',
    credentials: true,
  });
  app.use(cookieParser());

  console.log(`Application is running: http://localhost:${port}/api-docs`);
}
bootstrap();
