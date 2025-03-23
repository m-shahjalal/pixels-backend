import { DataSource } from 'typeorm';

import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { AppConfigService } from '@config/config.service';
import { ConfigService } from '@nestjs/config';

const configService = new AppConfigService(new ConfigService());
const dbConfig = configService.databaseConfig;

export const datasource = new DataSource({
  ...dbConfig,
  synchronize: process.argv.includes('info') ? false : dbConfig.synchronize,
  migrations: ['src/database/migrations/*.ts'],
  factories: ['src/database/factories/**/*{.ts,.js}'],
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
} as DataSourceOptions & SeederOptions);
