import { HttpStatus } from '@nestjs/common';

import { createException } from './exception.factory';
import { ExceptionType } from './exception.type';

const ExceptionOf = {
  USER: createException(ExceptionType.USER),
  INTERNAL: createException(ExceptionType.INTERNAL),
  EXTERNAL: createException(ExceptionType.EXTERNAL),
};

export class UserNotFoundException extends ExceptionOf.USER(
  HttpStatus.NOT_FOUND,
  '존재하지 않는 유저입니다.' as const,
) {}

export class TagNotFoundException extends ExceptionOf.USER(
  HttpStatus.NOT_FOUND,
  '존재하지 않는 태그입니다.' as const,
) {}

export class PlaceNotFoundException extends ExceptionOf.USER(
  HttpStatus.NOT_FOUND,
  '지도에 등록되지 않은 장소 입니다.' as const,
) {}

export class DuplicateNicknameException extends ExceptionOf.USER(
  HttpStatus.CONFLICT,
  '이미 사용중인 닉네임입니다.' as const,
) {}

export class UserNotInMapException extends ExceptionOf.USER(
  HttpStatus.BAD_REQUEST,
  '지도에 참여하지 않은 사용자입니다.' as const,
) {}
