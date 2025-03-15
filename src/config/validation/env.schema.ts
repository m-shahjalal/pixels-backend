import { z } from 'zod';

export const envSchema = z.object({
  // App
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  APP_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .default('4000'),
  API_PREFIX: z.string().default('api'),

  // Database
  DB_HOST: z.string().default('pgsqldb'),
  DB_PORT: z.string().transform(Number).default('5432'),
  DB_USER: z.string().default('postgres'),
  DB_PASS: z.string().default('postgres'),
  DB_NAME: z.string().default('alysia'),

  // JWT
  JWT_SECRET: z.string().default('super-secret-jwt-key'),
  JWT_EXPIRATION: z.string().default('1d'),
  JWT_REFRESH_SECRET: z.string().default('super-secret-refresh-key'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),
});

export type EnvConfig = z.infer<typeof envSchema>;
