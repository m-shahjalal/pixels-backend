import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attribute } from './attribute.entity';

@Entity('attribute_values')
export class AttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Attribute, (attribute) => attribute.values)
  attribute: Attribute;

  @Column()
  attributeId: number;

  @Column({ length: 100 })
  value: string;

  @Column({ length: 100 })
  displayValue: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
