import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AttributeValue } from './attribute-value.entity';
import { BaseEntity } from 'typeorm';

@Entity('attributes')
export class Attribute extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ length: 100 })
  displayName: string;

  @OneToMany(() => AttributeValue, (value) => value.attribute)
  values: AttributeValue[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
