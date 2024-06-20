import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';

import { Roles, USER } from '../constant/role.constant';
import { PassportAuthGuard } from '../guards/passport-auth.guard';

export const UseAuthGuard = (roles?: Roles[] | Roles) =>
  applyDecorators(
    SetMetadata(
      'roles',
      roles ? (Array.isArray(roles) ? roles : [roles]) : [USER],
    ),
    UseGuards(PassportAuthGuard),
  );
