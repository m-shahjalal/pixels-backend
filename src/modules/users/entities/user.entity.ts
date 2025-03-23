import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  Unique,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
} from 'typeorm';
import { BaseEntity } from '@/common/entities/base.entity';
import { ROLE } from '@/common/constants/role.constant';
import { Role } from '@/common/entities/role.entity';

export enum UserState {
  ACTIVE = 'active',
  DEACTIVATED = 'deactivated',
  BLOCKED = 'blocked',
  PENDING = 'pending',
}

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 200, unique: true, nullable: false })
  email: string;

  @Column({ length: 20, unique: true, nullable: true })
  phone: string;

  @Column({ length: 100, name: 'passwordHash' })
  password: string;

  @Column({ type: 'enum', enum: ROLE, default: ROLE.USER })
  role: ROLE;

  @Column({ name: 'first_name', length: 100, nullable: true })
  firstName: string;

  @Column({ name: 'last_name', length: 100, nullable: true })
  lastName: string;

  @Column({ length: 255, default: 'Anonymous User' })
  name: string;

  @Unique('username', ['username'])
  @Column({ length: 200, nullable: true })
  username: string;

  @Column({ type: 'enum', enum: UserState, default: UserState.PENDING })
  state: UserState;

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

  @Column({ nullable: true })
  avatar: string;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  updateName() {
    const fullName = [this.firstName, this.lastName].filter(Boolean).join(' ');
    this.name = fullName || this.name || 'Anonymous User';
  }
}
