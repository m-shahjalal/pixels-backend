import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './validation/env.schema';
import appConfig from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (config) => envSchema.parse(config),
      isGlobal: true,
      cache: true,
      expandVariables: true,
      load: [appConfig],
    }),
  ],
})
export class AppConfigModule {}
