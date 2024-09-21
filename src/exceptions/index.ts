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

export class DuplicateTagException extends ExceptionOf.USER(
  HttpStatus.CONFLICT,
  '중복되는 태그입니다.' as const,
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

export class UserMapRoleBadRequestException extends ExceptionOf.USER(
  HttpStatus.BAD_REQUEST,
  '어드민으로 변경할 수 없습니다.' as const,
) {}

export class UserMapNotFoundException extends ExceptionOf.USER(
  HttpStatus.NOT_FOUND,
  '해당 유저는 해당 지도의 멤버가 아닙니다.' as const,
) {}

export class UserMapRoleCannotMineException extends ExceptionOf.USER(
  HttpStatus.BAD_REQUEST,
  '자신의 권한은 변경할 수 없습니다.' as const,
) {}

export class MapNotFoundException extends ExceptionOf.USER(
  HttpStatus.NOT_FOUND,
  '존재하지 않는 지도입니다.' as const,
) {}

export class InviteLinkInvalidException extends ExceptionOf.USER(
  HttpStatus.GONE,
  '유효하지 않은 초대링크입니다.' as const,
) {}

export class UserMapConflictException extends ExceptionOf.USER(
  HttpStatus.CONFLICT,
  '이미 지도에 가입된 유저입니다.' as const,
) {}

export class PlaceForMapConflictException extends ExceptionOf.USER(
  HttpStatus.CONFLICT,
  '이미 생성된 지도입니다.' as const,
) {}

export class PlaceNotMineException extends ExceptionOf.USER(
  HttpStatus.FORBIDDEN,
  '내가 등록한 장소만 삭제할 수 있습니다.' as const,
) {}
