import { registerAs } from '@nestjs/config';
import { Config } from './interfaces/config.interface';

export const CONFIG_KEY = 'config';

export default registerAs(
  CONFIG_KEY,
  (): Config => ({
    app: {
      port: parseInt(process.env.APP_PORT || '4000', 10),
      env: process.env.NODE_ENV || 'development',
      apiPrefix: process.env.API_PREFIX || 'api',
    },
    database: {
      type: 'postgres',
      host: process.env.DB_HOST || 'pgsqldb',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'alysia',
      entities: ['dist/**/*.entity{.ts,.js}'],
      migrations: ['dist/database/migrations/*{.ts,.js}'],
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
      autoLoadEntities: true,
      ssl: process.env.NODE_ENV === 'production',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'super-secret',
      expiresIn: process.env.JWT_EXPIRATION || '1d',
      refreshSecret: process.env.JWT_REFRESH_SECRET || 'super-refresh-secret',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    },
  }),
);
