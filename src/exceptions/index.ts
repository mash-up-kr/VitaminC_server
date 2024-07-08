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

export class PlaceNotFoundException extends ExceptionOf.USER(
  HttpStatus.NOT_FOUND,
  '지도에 등록되지 않은 장소 입니다.' as const,
) {}

export class DuplicateNicknameException extends ExceptionOf.USER(
  HttpStatus.CONFLICT,
  '이미 사용중인 닉네임입니다.' as const,
) {}

export class UserMapNotFoundException extends ExceptionOf.USER(
  HttpStatus.NOT_FOUND,
  '해당 유저는 해당 지도의 멤버가 아닙니다.' as const,
) {}

export class MapNotFoundException extends ExceptionOf.USER(
  HttpStatus.NOT_FOUND,
  '존재하지 않는 지도입니다.' as const,
) {}

export class InviteLinkGoneException extends ExceptionOf.USER(
  HttpStatus.GONE,
  '만료된 초대링크입니다.' as const,
) {}

export class UserMapConflictException extends ExceptionOf.USER(
  HttpStatus.CONFLICT,
  '이미 지도에 가입된 유저입니다.' as const,
) {}
