import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import { z } from 'zod';
import configuration from './configuration';

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

export const configModuleOptions: ConfigModuleOptions = {
  envFilePath: '.env',
  load: [configuration],
  validationSchema,
  validate: (config: Record<string, any>) => {
    const result = validationSchema.safeParse(config);
    if (!result.success) {
      const err = `Environment validation failed: ${JSON.stringify(result.error.errors)}`;
      throw new Error(err);
    }
    return result.data;
  },
};
