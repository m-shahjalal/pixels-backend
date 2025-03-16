import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@modules/user/services/user.service';
import { EmailService } from '@common/services/email.service';
import { SmsService } from '@common/services/sms.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { VerifyPhoneDto } from './dto/verify-phone.dto';
import {
  RequestPasswordResetDto,
  ResetPasswordDto,
} from './dto/reset-password.dto';
import { AuthResponse } from './dto/auth-response.dto';
import { User } from '@modules/user/entities/user.entity';
import { UserAccessTokenClaims } from '@common/dtos/auth-token-output.dto';
import { randomBytes } from 'crypto';
import { AppLogger } from '@common/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
    private readonly logger: AppLogger,
  ) {
    this.logger.setContext(AuthService.name);
  }

  async validateUser(
    identifier: string,
    password: string,
  ): Promise<UserAccessTokenClaims> {
    const user = await this.userService.findByEmailOrPhone(identifier);
    const isPasswordValid = await this.userService.validatePassword(
      user,
      password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const identifier = loginDto.email || loginDto.phone;
    if (!identifier) {
      throw new BadRequestException('Email or phone is required');
    }

    const user = await this.validateUser(identifier, loginDto.password);
    return this.generateTokens(user);
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    try {
      this.logger.log('Starting user registration process');

      if (!registerDto.email && !registerDto.phone) {
        this.logger.error('Registration failed: Email or phone is required');
        throw new BadRequestException('Email or phone is required');
      }

      const user = await this.userService.create(registerDto);
      this.logger.log(`User created successfully with id: ${user.id}`);

      const payload: UserAccessTokenClaims = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      const tokens = this.generateTokens(payload);
      this.logger.log('Generated authentication tokens');

      return tokens;
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<void> {
    const user = await this.userService.findByVerificationToken(
      verifyEmailDto.token,
    );

    if (
      !user ||
      !user.verificationToken ||
      user.verificationTokenExpires < new Date()
    ) {
      throw new BadRequestException('Invalid or expired verification token');
    }

    user.isEmailVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await this.userService.save(user);
  }

  async verifyPhone(verifyPhoneDto: VerifyPhoneDto): Promise<void> {
    const user = await this.userService.findByPhone(verifyPhoneDto.phone);

    if (
      !user ||
      !user.phoneOtp ||
      user.phoneOtpExpires < new Date() ||
      user.phoneOtp !== verifyPhoneDto.otp
    ) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    user.isPhoneVerified = true;
    user.phoneOtp = null;
    user.phoneOtpExpires = null;
    await this.userService.save(user);
  }

  async requestPasswordReset(dto: RequestPasswordResetDto): Promise<void> {
    const identifier = dto.email || dto.phone;
    if (!identifier) {
      throw new BadRequestException('Email or phone is required');
    }

    const user = await this.userService.findByEmailOrPhone(identifier);
    if (dto.phone) {
      const otp = this.smsService.generateOtp();
      user.resetToken = otp;
      user.resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await this.userService.save(user);
      return await this.smsService.sendPasswordResetOtp(user.phone, otp);
    }

    if (!dto.email) return;

    const token = this.generateVerificationToken();
    user.resetToken = token;
    user.resetTokenExpires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
    await this.userService.save(user);
    await this.emailService.sendPasswordResetEmail(user.email, token);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const user = await this.userService.findByResetToken(
      resetPasswordDto.token,
    );

    if (!user || !user.resetToken || user.resetTokenExpires < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    user.password = resetPasswordDto.password;
    user.resetToken = null;
    user.resetTokenExpires = null;
    await this.userService.save(user);
  }

  async refreshToken(user: UserAccessTokenClaims): Promise<AuthResponse> {
    const freshUser = await this.userService.findById(user.id);
    if (!freshUser) {
      throw new UnauthorizedException('User not found');
    }

    const payload: UserAccessTokenClaims = {
      id: freshUser.id,
      email: freshUser.email,
      role: freshUser.role,
    };
    return this.generateTokens(payload);
  }

  async getUserById(id: string): Promise<User> {
    return this.userService.findById(id);
  }

  private generateTokens(payload: UserAccessTokenClaims): AuthResponse {
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get('JWT_EXPIRES_IN') || '7d',
      }),
    };
  }

  private generateVerificationToken(): string {
    return randomBytes(32).toString('hex');
  }
}
