import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { ProductVariant } from './product-variant.entity';
import { AttributeValue } from './attribute-value.entity';

@Entity('variant_attribute_values')
export class VariantAttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductVariant, (variant) => variant.attributeValues)
  variant: ProductVariant;

  @Column()
  variantId: number;

  @ManyToOne(() => AttributeValue)
  attributeValue: AttributeValue;

  @Column()
  attributeValueId: number;
}
