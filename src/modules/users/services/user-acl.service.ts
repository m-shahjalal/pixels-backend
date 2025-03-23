import { Injectable } from '@nestjs/common';
import { ROLE } from '@/common/constants/role.constant';
import { ResourceModule } from '@/common/enums/resource-modules.enum';
import { ResourceAction } from '@/common/enums/resource-action.enum';
import { BaseAclService } from '@/common/acl/base-acl.service';

@Injectable()
export class UserAclService extends BaseAclService {
  constructor() {
    super();
    // Set up permissions for ADMIN
    this.registerPermission(
      ROLE.ADMIN,
      ResourceModule.USERS,
      ResourceAction.CREATE,
    );
    this.registerPermission(
      ROLE.ADMIN,
      ResourceModule.USERS,
      ResourceAction.READ,
    );
    this.registerPermission(
      ROLE.ADMIN,
      ResourceModule.USERS,
      ResourceAction.UPDATE,
    );
    this.registerPermission(
      ROLE.ADMIN,
      ResourceModule.USERS,
      ResourceAction.DELETE,
    );
    this.registerPermission(
      ROLE.ADMIN,
      ResourceModule.USERS,
      ResourceAction.LIST,
    );

    // Set up permissions for USER
    this.registerPermission(
      ROLE.USER,
      ResourceModule.USERS,
      ResourceAction.READ,
    );
    this.registerPermission(
      ROLE.USER,
      ResourceModule.USERS,
      ResourceAction.UPDATE,
      () => true,
    );
  }

  protected isUserItself(userId: string, currentUserId: string): boolean {
    return userId === currentUserId;
  }
}
