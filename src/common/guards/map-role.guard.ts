import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { MapService } from 'src/map/map.service';

@Injectable()
export class MapRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly mapService: MapService,
  ) {}

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
    const mapId = request.params.mapId || request.params.id;

    const hasMapRole = async () => {
      try {
        const userMap = await this.mapService.findUserMap(user.id, mapId);
        return mapRoles.some((role) => userMap.role?.includes(role));
      } catch (e) {
        return false;
      }
    };

    return await hasMapRole();
  }
}
