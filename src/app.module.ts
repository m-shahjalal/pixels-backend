import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from './config/config.module';
import { AppController } from './app.controller';
import { SharedModule } from './common/shared.module';
import { TypeOrmConfigService } from './config/database.service';

@Module({
  imports: [
    AppConfigModule,
    SharedModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
