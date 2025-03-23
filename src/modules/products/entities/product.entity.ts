import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';
import { Brand } from './brand.entity';
import { BaseEntity } from 'typeorm';

@Entity('products')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @ManyToOne(() => Category, { nullable: true })
  category: Category;

  @Column({ nullable: true })
  categoryId: number;

  @ManyToOne(() => Brand, { nullable: true })
  brand: Brand;

  @Column({ nullable: true })
  brandId: number;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  taxRate: number;

  // SEO Fields
  @Column({ length: 255, nullable: true })
  metaTitle: string;

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  // Social Media Integration
  @Column({ nullable: true })
  facebookProductId: string;

  // Relationships
  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];

  // Timestamps
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
