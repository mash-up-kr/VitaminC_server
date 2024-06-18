import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { PassportAuthGuard } from '../guards/passport-auth.guard';
import { Roles, USER } from '../constant/role.constant';

export const UseAuthGuard = (roles?: Roles[] | Roles) =>
  applyDecorators(
    SetMetadata(
      'roles',
      roles ? (Array.isArray(roles) ? roles : [roles]) : [USER],
    ),
    UseGuards(PassportAuthGuard),
  );
