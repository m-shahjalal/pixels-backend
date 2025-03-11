import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export enum UserState {
  ACTIVE = 'active',
  DEACTIVATED = 'deactivated',
  BLOCKED = 'blocked',
  PENDING = 'pending',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, nullable: true })
  firstName: string | null;

  @Column({ length: 100, nullable: true })
  lastName: string | null;

  @Unique('username', ['username'])
  @Column({ length: 200, nullable: true })
  username: string | null;

  @Column({ type: 'enum', enum: UserState, default: UserState.PENDING })
  state: UserState;

  @Unique('email', ['email'])
  @Column({ length: 200 })
  email: string;

  @Column({ length: 100 })
  password: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @Column({ name: 'deletedAt', nullable: true })
  deletedAt: Date;
}
