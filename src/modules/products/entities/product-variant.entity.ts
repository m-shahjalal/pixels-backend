import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { VariantAttributeValue } from './variant-attribute-value.entity';

@Entity('product_variants')
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.variants)
  product: Product;

  @Column()
  productId: number;

  @Column({ length: 100 })
  sku: string;

  @Column({ length: 100, nullable: true })
  barcode: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  compareAtPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  costPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  weight: number;

  @Column({ length: 10, default: 'kg' })
  weightUnit: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(
    () => VariantAttributeValue,
    (attributeValue) => attributeValue.variant,
  )
  attributeValues: VariantAttributeValue[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
