import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsPhoneNumber, IsOptional } from 'class-validator';

export class RequestPasswordResetDto {
  @ApiProperty({ example: 'user@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'reset-token-123' })
  token: string;

  @ApiProperty({ example: 'newPassword123' })
  password: string;
}
