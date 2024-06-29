import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { CreateRequestContext, MikroORM } from '@mikro-orm/core';
import { NextFunction, Request, Response } from 'express';

import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly orm: MikroORM,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    void this.orm;
  }
  // 테스트를 위해 헤더에 Authorization을 추가하는 미들웨어

  @CreateRequestContext()
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const testUserId = this.configService.get<number>('TEST_USER_ID');
      if (testUserId && !Number.isNaN(testUserId)) {
        const user = await this.authService.signInForTestUser(testUserId);
        req.headers.authorization = `Bearer ${user.accessToken}`;
      }
    } finally {
      next();
    }
  }
}
