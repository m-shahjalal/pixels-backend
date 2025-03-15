import { UserAccessTokenClaims } from '../dtos/auth-token-output.dto';

export class RequestContext {
  requestID: string;

  url: string;

  ip: string;

  user?: UserAccessTokenClaims;
}
