import { Controller, Post, UseGuards } from '@nestjs/common';

import { CurrentId } from 'src/common/decorators/id.decorator';
import { KakaoGuard } from 'src/common/guards/kakao.guard';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('kakao')
  @UseGuards(KakaoGuard)
  signInToKakao(@CurrentId() id: string) {
    return this.authService.signInThroughOauth(`kakao_${id}`);
  }
}
