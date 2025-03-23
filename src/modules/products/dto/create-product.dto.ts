import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductVariantDto {
  @ApiProperty({ description: 'Unique SKU for the variant' })
  @IsString()
  sku: string;

  @ApiPropertyOptional({ description: 'Barcode for the variant' })
  @IsString()
  @IsOptional()
  barcode?: string;

  @ApiProperty({ description: 'Price of the variant', minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ description: 'Compare at price', minimum: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  compareAtPrice?: number;

  @ApiPropertyOptional({ description: 'Cost price', minimum: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  costPrice?: number;

  @ApiPropertyOptional({ description: 'Weight of the variant', minimum: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({
    description: 'Weight unit (e.g., kg, g)',
    default: 'kg',
  })
  @IsString()
  @IsOptional()
  weightUnit?: string;

  @ApiPropertyOptional({
    description: 'Whether the variant is active',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'IDs of attribute values for this variant',
    type: [Number],
  })
  @IsArray()
  @IsOptional()
  attributeValueIds?: number[];
}

export class CreateProductDto {
  @ApiProperty({ description: 'Title of the product' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Product description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Category ID' })
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiPropertyOptional({ description: 'Brand ID' })
  @IsNumber()
  @IsOptional()
  brandId?: number;

  @ApiPropertyOptional({
    description: 'Whether the product is featured',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({
    description: 'Whether the product is active',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Tax rate percentage',
    minimum: 0,
    maximum: 100,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  taxRate?: number;

  @ApiPropertyOptional({ description: 'Meta title for SEO' })
  @IsString()
  @IsOptional()
  metaTitle?: string;

  @ApiPropertyOptional({ description: 'Meta description for SEO' })
  @IsString()
  @IsOptional()
  metaDescription?: string;

  @ApiPropertyOptional({ description: 'Product tags', type: [String] })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: 'Product variants',
    type: [CreateProductVariantDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants: CreateProductVariantDto[];
}
