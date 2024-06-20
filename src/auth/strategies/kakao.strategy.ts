import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { Strategy, VerifiedCallback } from 'passport-custom';

import { AuthService } from '../auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super();
  }

  async validate(req: Request, done: VerifiedCallback) {
    const { authorization: accessToken } = req.headers;

    if (!/^bearer/i.test(accessToken))
      throw new BadRequestException('Format of the access token is invalid');

    if (!accessToken)
      throw new BadRequestException('Authorizaion in headers is required');

    const id = await this.authService.signInToKakao(accessToken);

    return done(null, { id });
  }
}
