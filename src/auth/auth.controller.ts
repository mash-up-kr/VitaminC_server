import { Controller, Post, UseGuards } from '@nestjs/common';

import { CurrentId } from 'src/common/decorators/id.decorator';
import { KakaoGuard } from 'src/common/guards/kakao.guard';
import { UserProvider } from 'src/users/entities/user.type';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('kakao')
  @UseGuards(KakaoGuard)
  signInToKakao(@CurrentId() providerId: string) {
    return this.authService.signInThroughOauth({
      provider: UserProvider.KAKAO,
      providerId,
    });
  }
}
