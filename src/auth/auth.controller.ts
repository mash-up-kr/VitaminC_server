import { Controller, Post, UseGuards } from '@nestjs/common';

import { $Enums } from '@prisma/client';

import { CurrentId } from 'src/common/decorators/id.decorator';
import { KakaoGuard } from 'src/common/guards/kakao.guard';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('kakao')
  @UseGuards(KakaoGuard)
  signInToKakao(@CurrentId() providerId: string) {
    return this.authService.signInThroughOauth({
      provider: $Enums.Provider.KAKAO,
      providerId,
    });
  }
}
