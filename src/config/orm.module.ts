// database.module.ts
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from './config.module';
import { AppConfigService } from './config.service';

@Global()
@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        type: 'postgres',
        host: configService.database.host,
        port: configService.database.port,
        username: configService.database.username,
        password: configService.database.password,
        database: configService.database.database,
        entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
        synchronize: configService.database.synchronize,
        logging: configService.database.logging,
        ssl: configService.database.ssl,
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class OrmModule {}
