export * from './common';
export * from './role.constant';

// Request Headers
export const REQUEST_ID_TOKEN_HEADER = 'x-request-id';
export const FORWARDED_FOR_TOKEN_HEADER = 'x-forwarded-for';

// Actions
export enum ACTION {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  MANAGE = 'manage',
}

// Actor Types
export enum ACTOR {
  USER = 'user',
  ADMIN = 'admin',
  SYSTEM = 'system',
}
