import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CurrentId } from 'src/common/decorators/id.decorator';
import { KakaoGuard } from 'src/common/guards/kakao.guard';
import { UserProvider } from 'src/user/entities/user.type';

import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('api/v1/auth')
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
