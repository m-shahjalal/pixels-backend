import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { configModuleOptions } from '../configs/module-options';

import { AppLoggerModule } from './logger/logger.module';
import { LoggingInterceptor } from '../pipelines/interceptors/logging.interceptor';
import { AllExceptionsFilter } from '../pipelines/filters/all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot(configModuleOptions),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('database.host'),
        port: configService.get<number | undefined>('database.port'),
        database: configService.get<string>('database.name'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.pass'),
        entities: [`${__dirname}/../**/entities/*.entity{.ts,.js}`],
        // Timezone configured on the Postgres server.
        // This is used to typecast server date/time values to JavaScript Date object and vice versa.
        timezone: 'Z',
        synchronize: configService.get<string>('env') === 'development',
        debug: configService.get<string>('env') === 'development',
      }),
    }),
    AppLoggerModule,
  ],
  exports: [AppLoggerModule, ConfigModule],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class SharedModule {}
