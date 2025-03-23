import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../modules/users/entities/user.entity';
import { Product } from '../../modules/products/entities/product.entity';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    console.log('...............Seeding...............');

    // Clear existing data
    console.log('clearing existing data...');
    await dataSource.getRepository(User).clear();

    const userFactory = factoryManager.get(User);

    await dataSource.getRepository(Product).clear();

    console.log('seeding users...');
    await userFactory.saveMany(10);

    const productFactory = factoryManager.get(Product);

    console.log('seeding products...');
    await productFactory.saveMany(10);
  }
}
