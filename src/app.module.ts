import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SharedModule } from './common/shared.module';
import { AppConfigModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomersModule } from './modules/customers/customers.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { MarketingModule } from './modules/marketing/marketing.module';
import { ProductsModule } from './modules/products/products.module';
import { StorefrontModule } from './modules/storefront/storefront.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AppConfigModule,
    SharedModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    InventoryModule,
    StorefrontModule,
    CustomersModule,
    MarketingModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
