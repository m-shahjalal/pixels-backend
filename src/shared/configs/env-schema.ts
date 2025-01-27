import { z } from 'zod';

export const validationSchema = z.object({
  APP_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_PORT: z.coerce.number().min(2000).max(65_535),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().min(2000).max(65_535).default(5432),
  DB_NAME: z.string().min(3),
  DB_USER: z.string().min(3),
  DB_PASS: z.string().min(3),
  JWT_PUBLIC_KEY_BASE64: z.string().min(1),
  JWT_PRIVATE_KEY_BASE64: z.string().min(1),
  JWT_ACCESS_TOKEN_EXP_IN_SEC: z.coerce.number().positive(),
  JWT_REFRESH_TOKEN_EXP_IN_SEC: z.coerce.number().positive(),
  DEFAULT_ADMIN_USER_PASSWORD: z.string().min(6),
});

export type EnvConfig = z.infer<typeof validationSchema>;
