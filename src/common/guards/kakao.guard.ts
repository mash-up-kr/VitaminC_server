import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class KakaoGuard extends AuthGuard('kakao') {
  getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
