// import { ROLE } from './../../auth/constants/role.constant';

/**
 * The actor who is performing the action
 */
export interface Actor {
  id: number;

  roles: string[];
}
