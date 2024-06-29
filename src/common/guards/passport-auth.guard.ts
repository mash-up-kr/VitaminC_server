import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import { UserRole } from 'src/entities';

@Injectable()
export class PassportAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    await super.canActivate(context);
    const req = context.switchToHttp().getRequest();
    const { role } = req.user;

    if (role === UserRole.ADMIN) {
      return true;
    }

    return this.hasAccess(role, requiredRoles);
  }

  getRequest(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    return req;
  }

  private hasAccess(role: string, requiredRoles: string[]): boolean {
    return requiredRoles.some((v: string) => v === role);
  }
}
