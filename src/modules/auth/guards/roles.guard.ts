import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLE } from '@/common/constants/role.constant';
import { ROLES_KEY, SYSTEM_ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const systemRoles = this.reflector.get<ROLE[]>(
      SYSTEM_ROLES_KEY,
      context.getHandler(),
    );
    const roles = this.reflector.get<ROLE[]>(ROLES_KEY, context.getHandler());

    if (!systemRoles && !roles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }

    if (systemRoles) {
      return this.matchSystemRoles(user, systemRoles);
    }

    if (roles) {
      return this.matchRoles(user, roles);
    }

    return false;
  }

  private matchSystemRoles(user: any, requiredRoles: ROLE[]): boolean {
    return requiredRoles.some((role) => user.role === role);
  }

  private matchRoles(user: any, requiredRoles: ROLE[]): boolean {
    return requiredRoles.some((role) => user.roles.includes(role));
  }
}
