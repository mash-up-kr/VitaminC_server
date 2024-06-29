import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { KakaoPayload } from 'src/auth/strategies/kakao.strategy';

export const KakaoInfo = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<{
      user: KakaoPayload;
    }>();
    return request.user;
  },
);
