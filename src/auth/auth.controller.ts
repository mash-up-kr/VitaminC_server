import { Controller, Get, Redirect, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { KakaoInfo } from 'src/common/decorators/kakao-info.decorator';
import { KakaoGuard } from 'src/common/guards/kakao.guard';
import { NODE_ENVIRONMENT } from 'src/common/helper/env.validation';
import { UserProvider } from 'src/entities';

import { AuthService } from './auth.service';
import { KakaoPayload } from './strategies/kakao.strategy';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Get('kakao')
  @UseGuards(KakaoGuard)
  @Redirect('http://localhost:3000', 302)
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
      // httpOnly: true,
      sameSite: 'lax',
      secure: true,
    });

    // return res.redirect(302, this.configService.get('CLIENT_URL'));
  }
}
