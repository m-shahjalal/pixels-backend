import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AppConfigService } from './config.service';

const configService = new AppConfigService(new ConfigService());
const dbConfig = configService.database;

const AppDataSource = new DataSource({
  type: 'postgres',
  host: dbConfig.host,
  port: dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.database,
  synchronize: false,
  entities: ['**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  migrationsRun: true,
  logging: false,
});

export default AppDataSource;
