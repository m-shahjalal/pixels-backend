import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';

import { AppLogger } from '../shared/logger/logger.service';
import { RequestContext } from '../utils/request-context/request-context.dto';
import { UserOutput } from '../modules/user/dtos/user-output.dto';
import { UserService } from '../modules/user/services/user.service';
import { RegisterInput } from './dtos/auth-register-input.dto';
import { RegisterOutput } from './dtos/auth-register-output.dto';
import {
  AuthTokenOutput,
  UserAccessTokenClaims,
} from './dtos/auth-token-output.dto';
import { LoginInput } from './dtos/auth-login-input.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async validateUser(
    username: string,
    pass: string,
  ): Promise<UserAccessTokenClaims> {
    // Prevent disabled users from logging in.
    // if (user.state !== UserState.ACTIVE) {
    //   throw new UnauthorizedException('This user account has been disabled');
    // }

    return await this.userService.validateUsernamePassword(username, pass);
  }

  async login(input: LoginInput): Promise<AuthTokenOutput> {
    const user = await this.validateUser(input.email, input.password);
    return this.getAuthToken(user);
  }

  async register(input: RegisterInput): Promise<RegisterOutput> {
    const registeredUser = await this.userService.createUser(input);
    return plainToClass(RegisterOutput, registeredUser, {
      excludeExtraneousValues: true,
    });
  }

  async refreshToken(ctx: RequestContext): Promise<AuthTokenOutput> {
    const user = await this.userService.findById(ctx, ctx.user!.id);
    if (!user) {
      throw new UnauthorizedException('Invalid user id');
    }

    return this.getAuthToken(user);
  }

  getAuthToken(user: UserAccessTokenClaims | UserOutput): AuthTokenOutput {
    const subject = { sub: user.id };
    const payload = { username: user.username ?? user.email, sub: user.id };

    const authToken = {
      refreshToken: this.jwtService.sign(subject, {
        expiresIn: this.configService.get('jwt.refreshTokenExpiresInSec'),
      }),
      accessToken: this.jwtService.sign(
        { ...payload, ...subject },
        { expiresIn: this.configService.get('jwt.accessTokenExpiresInSec') },
      ),
    };
    return plainToClass(AuthTokenOutput, authToken, {
      excludeExtraneousValues: true,
    });
  }
}
