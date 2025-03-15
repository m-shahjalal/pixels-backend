import { registerAs } from '@nestjs/config';

export interface AppConfig {
  port: number;
  env: string;
  apiPrefix: string;
}

export const APP_CONFIG_KEY = 'app';

export default registerAs(
  APP_CONFIG_KEY,
  (): AppConfig => ({
    port: parseInt(process.env.APP_PORT || '4000', 10),
    env: process.env.NODE_ENV || 'development',
    apiPrefix: process.env.API_PREFIX || 'api',
  }),
);
