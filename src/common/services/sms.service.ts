import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import twilio from 'twilio';

@Injectable()
export class SmsService {
  private client: twilio.Twilio;

  constructor(private readonly configService: ConfigService) {
    this.client = twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN'),
    );
  }

  async sendOtp(phone: string, otp: string): Promise<void> {
    await this.client.messages.create({
      body: `Your verification code is: ${otp}`,
      from: this.configService.get('TWILIO_PHONE_NUMBER'),
      to: phone,
    });
  }

  async sendPasswordResetOtp(phone: string, otp: string): Promise<void> {
    await this.client.messages.create({
      body: `Your password reset code is: ${otp}`,
      from: this.configService.get('TWILIO_PHONE_NUMBER'),
      to: phone,
    });
  }

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
