import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ResourceAction,
  ResourceActionType,
} from '../enums/resource-action.enum';
import {
  ResourceModule,
  ResourceModuleType,
} from '../enums/resource-modules.enum';
import { Role } from './role.entity';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    enum: ResourceModule,
  })
  resource: ResourceModuleType;

  @Column({
    type: 'varchar',
    enum: ResourceAction,
  })
  action: ResourceActionType;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
