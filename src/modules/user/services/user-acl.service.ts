import { Injectable } from '@nestjs/common';
import { BaseAclService } from '../../../common/acl/base-acl.service';
import { ACTION, ROLE } from '../../../common/constants';

@Injectable()
export class UserAclService extends BaseAclService {
  constructor() {
    super();
    // Set up permissions
    this.canDo(ROLE.ADMIN, [ACTION.MANAGE]);
    this.canDo(ROLE.USER, [ACTION.READ]);
    this.canDo(ROLE.USER, [ACTION.UPDATE], () => true);
  }

  protected isUserItself(userId: string, currentUserId: string): boolean {
    return userId === currentUserId;
  }
}
