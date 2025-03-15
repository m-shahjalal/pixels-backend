import { ROLE } from '../constants';

export interface Actor {
  id: string;
  role: ROLE;
  email: string;
}
