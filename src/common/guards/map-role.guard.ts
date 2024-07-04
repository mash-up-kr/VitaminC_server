import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserMapRole } from 'src/entities';
import { UserMapService } from 'src/user-map/user-map.service';

@Injectable()
export class MapRoleGuard implements CanActivate {
  private readonly mapId: string;
  constructor(
    private reflector: Reflector,
    private readonly userMapService: UserMapService,
  ) {
    this.mapId = '';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const mapRoles = this.reflector.get<string[]>(
      'map-roles',
      context.getHandler(),
    );
    if (!mapRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const mapId = request.params.id;

    const hasMapRole = async () => {
      try {
        const userMap = await this.userMapService.findOneByUserAndMap(
          user.id,
          mapId,
        );
        return mapRoles.some((role) => userMap.role?.includes(role));
      } catch (e) {
        return false;
      }
    };

    return await hasMapRole();
  }

  private isOnlyAdmin(mapRoles: string[]): boolean {
    return mapRoles.length === 1 && mapRoles[0] === UserMapRole.ADMIN;
  }
}
