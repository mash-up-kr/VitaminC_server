import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

import { NextFunction, Request, Response } from 'express';
import moment from 'moment-timezone';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    const start = Date.now();

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      const end = Date.now();
      const duration = end - start;
      const koreaTime = moment().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');

      const logMessage = `${koreaTime} - ${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} - ${duration}ms`;
      this.logger.log(logMessage);
    });

    next();
  }
}
