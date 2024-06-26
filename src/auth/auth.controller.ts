import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Response } from 'express';

import { KakaoInfo } from 'src/common/decorators/kakao-info.decorator';
import { KakaoGuard } from 'src/common/guards/kakao.guard';
import { UserProvider } from 'src/user/entities/user.type';

import { AuthService } from './auth.service';
import { KakaoPayload } from './strategies/kakao.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('kakao')
  @UseGuards(KakaoGuard)
  async signInToKakao(
    @KakaoInfo() { id, accessToken, refreshToken }: KakaoPayload,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.authService.signInThroughOauth({
      provider: UserProvider.KAKAO,
      providerId: id.toString(),
      kakaoAccessToken: accessToken,
      kakaoRefreshToken: refreshToken,
    });

    res.cookie('Authorization', 'Bearer ' + user.accessToken, {
      httpOnly: true,
    });

    return res.redirect(302, this.configService.get('CLIENT_URL'));
  }
}
