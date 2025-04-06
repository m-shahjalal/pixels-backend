import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ResourceModuleType } from '../../../common/enums/resource-modules.enum';
import { ResourceActionType } from '../../../common/enums/resource-action.enum';

export const PERMISSION_KEY = 'permission';

export interface RequiredPermission {
  resource: ResourceModuleType;
  action: ResourceActionType;
}

export const Auth = (
  resource: ResourceModuleType,
  action: ResourceActionType,
) => {
  return applyDecorators(
    SetMetadata(PERMISSION_KEY, { resource, action }),
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden' }),
  );
};

export const AuthResource = (resource: ResourceModuleType) => {
  return applyDecorators(SetMetadata(PERMISSION_KEY, { resource }));
};

export const AuthAction = (action: ResourceActionType) => {
  return applyDecorators(SetMetadata(PERMISSION_KEY, { action }));
};
