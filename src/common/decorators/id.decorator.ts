import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentId = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user.id;
  },
);
