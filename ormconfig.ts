import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const typeOrmConfig = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  entities: [`${__dirname}/src/**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations/**/*{.ts,.js}`],
  migrationsRun: false,
  synchronize: process.env.NODE_ENV === 'development',
});

export default typeOrmConfig;
