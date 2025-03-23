export class UserAccessTokenClaims {
  id: string;
  email: string;
  role: string;
}

export class UserRefreshTokenClaims {
  id: string;
  email: string;
}

export class UserAccessTokenOutput {
  accessToken: string;
  refreshToken: string;
}

export class UserRefreshTokenOutput {
  refreshToken: string;
}

export class UserLogoutOutput {
  message: string;
}
