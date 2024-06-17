import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { KakaoGuard } from 'src/common/guards/kakao.guard';
import { CurrentId } from 'src/common/decorators/id.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('kakao')
  @UseGuards(KakaoGuard)
  signInToKakao(@CurrentId() id: string) {
    return this.authService.signInThroughOauth(`kakao_${id}`);
  }
}
