import { Injectable } from '@nestjs/common';
import { ROLE } from '@/common/constants/role.constant';
import { ResourceActionType } from '@/common/enums/resource-action.enum';
import { ResourceModuleType } from '@/common/enums/resource-modules.enum';

@Injectable()
export class BaseAclService {
  private permissions: Map<
    ROLE,
    Array<{
      resource: ResourceModuleType;
      action: ResourceActionType;
      condition?: () => boolean;
    }>
  > = new Map();

  /**
   * Registers a permission for a specific role to perform an action on a resource.
   * This is a protected method meant to be used by extending classes to set up their permission rules.
   * @param role The role to grant the permission to
   * @param resource The resource the permission applies to
   * @param action The action being permitted
   * @param condition Optional condition that must be met for the permission to be granted
   */
  protected registerPermission(
    role: ROLE,
    resource: ResourceModuleType,
    action: ResourceActionType,
    condition?: () => boolean,
  ): void {
    const rolePermissions = this.permissions.get(role) || [];
    rolePermissions.push({ resource, action, condition });
    this.permissions.set(role, rolePermissions);
  }

  /**
   * Checks if a role has permission to perform an action on a resource.
   * This is the public interface for permission checks.
   * @param role The role to check permissions for
   * @param resource The resource being accessed
   * @param action The action being attempted
   * @returns boolean indicating if the action is permitted
   */
  can(
    role: ROLE,
    resource: ResourceModuleType,
    action: ResourceActionType,
  ): boolean {
    const rolePermissions = this.permissions.get(role);
    if (!rolePermissions) return false;

    const permission = rolePermissions.find(
      (p) => p.resource === resource && p.action === action,
    );

    if (!permission) return false;
    if (permission.condition) return permission.condition();
    return true;
  }

  protected isUserItself(userId: string, currentUserId: string): boolean {
    return userId === currentUserId;
  }
}
