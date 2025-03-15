import { Injectable } from '@nestjs/common';
import { ACTION, ACTOR, ROLE } from '../constants';

@Injectable()
export class BaseAclService {
  protected canDo(
    role: ROLE,
    actions: ACTION[],
    customCheck?: () => boolean | Promise<boolean>,
  ): boolean | Promise<boolean> {
    // Default implementation
    if (role === ROLE.ADMIN) {
      return true;
    }

    if (customCheck) {
      return customCheck();
    }

    return false;
  }

  protected isUserItself(userId: string, currentUserId: string): boolean {
    return userId === currentUserId;
  }
}
