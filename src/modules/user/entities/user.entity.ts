import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@common/entities/base.entity';
import { ROLE } from '@common/constants';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ROLE, default: ROLE.USER })
  role: ROLE;

  @Column({ name: 'first_name', nullable: true })
  firstName: string;

  @Column({ name: 'last_name', nullable: true })
  lastName: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ name: 'email_verified', default: false })
  isEmailVerified: boolean;

  @Column({ name: 'phone_verified', default: false })
  isPhoneVerified: boolean;

  @Column({ name: 'verification_token', nullable: true })
  verificationToken: string;

  @Column({ name: 'verification_token_expires', nullable: true })
  verificationTokenExpires: Date;

  @Column({ name: 'reset_token', nullable: true })
  resetToken: string;

  @Column({ name: 'reset_token_expires', nullable: true })
  resetTokenExpires: Date;

  @Column({ name: 'phone_otp', nullable: true })
  phoneOtp: string;

  @Column({ name: 'phone_otp_expires', nullable: true })
  phoneOtpExpires: Date;
}
