import { setSeederFactory } from 'typeorm-extension';
import { Product } from '../../modules/products/entities/product.entity';
import slugify from 'slugify';

export const ProductFactory = setSeederFactory(Product, (faker) => {
  const product = new Product();

  // Required fields
  product.title = faker.commerce.productName();
  product.slug = slugify(product.title, { lower: true });

  // Optional fields with nullable true
  product.description = faker.commerce.productDescription();
  product.categoryId = faker.number.int({ min: 1, max: 100 });
  product.brandId = faker.number.int({ min: 1, max: 50 });

  // Boolean flags
  product.isFeatured = faker.datatype.boolean();
  product.isActive = faker.datatype.boolean({ probability: 0.9 }); // 90% chance of being active

  // Numeric fields
  product.taxRate = parseFloat(
    faker.commerce.price({ min: 5, max: 20, dec: 2 }),
  );

  // SEO fields
  product.metaTitle = faker.helpers.arrayElement([
    null,
    `${product.title} | Store`,
  ]);
  product.metaDescription = faker.helpers.arrayElement([
    null,
    faker.lorem.sentences(2),
  ]);
  product.tags = faker.helpers.arrayElements(
    ['new', 'sale', 'trending', 'popular', 'featured', 'seasonal'],
    faker.number.int({ min: 0, max: 3 }),
  );

  // Social Media Integration
  product.facebookProductId = faker.helpers.arrayElement([
    null,
    faker.string.uuid(),
  ]);

  // Note: Relationships (variants, images, category, brand) should be handled in the seeder
  // as they require existing related entities

  product.variants = [];
  product.images = [];
  product.category = null;
  product.brand = null;

  return product;
});
