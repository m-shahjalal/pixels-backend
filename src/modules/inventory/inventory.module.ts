import { Module } from '@nestjs/common';
import { SharedModule } from '../../common/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class InventoryModule {}
