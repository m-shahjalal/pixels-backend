import { ROLE } from '../constants/role.constant';

export class UserAccessTokenClaims {
  id: string;
  email: string;
  role: ROLE;
}
