import { SetMetadata } from '@nestjs/common';
import { ROLE } from '@/common/constants/role.constant';

export const ROLES_KEY = 'roles';
export const SYSTEM_ROLES_KEY = 'systemRoles';

export const Roles = (...roles: ROLE[]) => SetMetadata(ROLES_KEY, roles);
export const SystemRoles = (...roles: ROLE[]) =>
  SetMetadata(SYSTEM_ROLES_KEY, roles);
