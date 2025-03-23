import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.images)
  product: Product;

  @Column()
  productId: number;

  @Column({ length: 255 })
  imageUrl: string;

  @Column({ length: 255, nullable: true })
  altText: string;

  @Column({ default: false })
  isPrimary: boolean;

  @Column({ default: 0 })
  displayOrder: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
