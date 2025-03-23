import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { BaseEntity } from 'typeorm';

@Entity('brands')
export class Brand extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ length: 255, nullable: true })
  logoUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
