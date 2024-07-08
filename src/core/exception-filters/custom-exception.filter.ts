import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import * as Sentry from '@sentry/nestjs';
import { Response } from 'express';

import { EnvType } from 'src/common/helper/env.validation';
import { BaseException } from 'src/exceptions/exception.abstract';
import { UtilService } from 'src/util/util.service';

type ResponseBody = {
  statusCode: number;
  message: string;
  error?: string;
};

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger();
  constructor(
    private readonly configService: ConfigService,
    private readonly utilService: UtilService,
  ) {}

  async catch(exception: BaseException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const responseBody: ResponseBody = {
      statusCode: 500,
      message: '예상치 못한 에러가 발생했습니다. 노드팀을 채찍질 해주세요',
    };

    if (exception instanceof BaseException) {
      responseBody.statusCode = exception.statusCode;
      responseBody.message = exception.composedMessage ?? exception.message;
    } else if (exception instanceof HttpException) {
      const httpExceptionResponse = exception.getResponse() as
        | string
        | ResponseBody;
      responseBody.statusCode = exception.getStatus();
      responseBody.message =
        typeof httpExceptionResponse === 'string'
          ? httpExceptionResponse
          : httpExceptionResponse.message;
    }

    if (exception instanceof Error && responseBody.statusCode === 500) {
      this.logger.error(
        `api : ${request.method} ${request.url} message : ${exception.message}`,
      );
      if (!this.utilService.isDev()) {
        this.sendErrorToSentry(exception);
        await this.sendErrorInfoToDiscord(request, exception);
      }
    }

    response.status(responseBody.statusCode).json(responseBody);
  }

  private sendErrorToSentry(exception: Error) {
    Sentry.captureException(exception);
  }

  private async sendErrorInfoToDiscord(request: Request, error: Error) {
    const discordWebhook = this.configService.get('DISCORD_WEBHOOK_URL');
    const NODE_ENV = this.configService.get('NODE_ENV');
    const content = this.parseError(request, error, NODE_ENV);

    await fetch(discordWebhook, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
  }

  private parseError(request: Request, error: Error, env: EnvType): string {
    return `노드팀 채찍 맞아라~~ 🦹🏿‍♀️👹🦹🏿
에러 발생 API : ${request.method} ${request.url}

에러 메세지 : ${error.message}

에러 위치 : ${error.stack
      .split('\n')
      .slice(0, 2)
      .map((message) => message.trim())
      .join('\n')}

에러 환경 : ${env}

당장 고쳐서 올렷!
    `;
  }
}
