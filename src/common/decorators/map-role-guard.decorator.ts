import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';

import { UserMapRole, UserMapRoleValueType } from 'src/entities';

import { MapRoleGuard } from '../guards/map-role.guard';

export const UseMapRoleGuard = (
  roles?: UserMapRoleValueType[] | UserMapRoleValueType,
) =>
  applyDecorators(
    SetMetadata(
      'map-roles',
      roles
        ? Array.isArray(roles)
          ? roles
          : [roles]
        : [UserMapRole.ADMIN, UserMapRole.READ, UserMapRole.WRITE],
    ),
    UseGuards(MapRoleGuard),
  );
