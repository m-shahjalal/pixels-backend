import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from './validation/env.validation';
import config from './config';
import { AppConfigService } from './app.config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validate,
      cache: true,
      expandVariables: true,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
