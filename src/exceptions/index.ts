import { createException } from './exception.factory';
import { ExceptionType } from './exception.type';

const ExceptionOf = {
  USER: createException(ExceptionType.USER),
  INTERNAL: createException(ExceptionType.INTERNAL),
  EXTERNAL: createException(ExceptionType.EXTERNAL),
};

// export class UserNotFoundException extends ExceptionOf.USER(400, '존재하지 않는 유저입니다.' as const) {}
