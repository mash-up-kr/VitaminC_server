import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';

import { UserRole, UserRoleValueType } from 'src/entities';

import { PassportAuthGuard } from '../guards/passport-auth.guard';

export const UseAuthGuard = (roles?: UserRoleValueType[] | UserRoleValueType) =>
  applyDecorators(
    SetMetadata(
      'roles',
      roles ? (Array.isArray(roles) ? roles : [roles]) : [UserRole.USER],
    ),
    UseGuards(PassportAuthGuard),
  );
