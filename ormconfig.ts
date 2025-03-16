import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'alysia',
  synchronize: false,
  entities: [`${__dirname}/dist/**/*.entity.ts`],
  migrations: ['src/database/migrations/*.ts'],
  migrationsRun: true,
  logging: false,
});

export default AppDataSource;
