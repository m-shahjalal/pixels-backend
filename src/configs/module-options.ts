import { ConfigModuleOptions } from '@nestjs/config';
import { z } from 'zod';

const envSchema = z
  .object({
    // App
    APP_ENV: z
      .enum(['development', 'production', 'test'])
      .default('development'),
    APP_PORT: z.coerce.number().default(4000),
    FRONTEND_URL: z.string().url().default('http://localhost:3000'),

    // Database
    DB_HOST: z.string().default('localhost'),
    DB_PORT: z.coerce.number().default(5432),
    DB_NAME: z.string().default('postgres'),
    DB_USER: z.string().default('postgres'),
    DB_PASS: z.string().default('postgres'),

    // JWT
    JWT_SECRET: z.string().default('super-secret-jwt-key-for-development'),
    JWT_EXPIRES_IN: z.string().default('7d'),

    // SMTP - Optional in development
    SMTP_HOST: z.string().optional(),
    SMTP_PORT: z.coerce.number().optional(),
    SMTP_SECURE: z.coerce.boolean().default(false),
    SMTP_USER: z.string().optional(),
    SMTP_PASS: z.string().optional(),
    SMTP_FROM: z.string().email().optional(),

    // Twilio - Optional in development
    TWILIO_ACCOUNT_SID: z.string().optional(),
    TWILIO_AUTH_TOKEN: z.string().optional(),
    TWILIO_PHONE_NUMBER: z.string().optional(),
  })
  .refine((data) => {
    // In production, ensure all required fields are present
    if (data.APP_ENV === 'production') {
      const requiredFields = [
        'SMTP_HOST',
        'SMTP_PORT',
        'SMTP_USER',
        'SMTP_PASS',
        'SMTP_FROM',
        'TWILIO_ACCOUNT_SID',
        'TWILIO_AUTH_TOKEN',
        'TWILIO_PHONE_NUMBER',
      ];

      for (const field of requiredFields) {
        if (!data[field]) {
          throw new Error(`${field} is required in production`);
        }
      }
    }
    return true;
  });

export type EnvConfig = z.infer<typeof envSchema>;

export const configModuleOptions: ConfigModuleOptions = {
  isGlobal: true,
  envFilePath: '.env',
  validate: (config: Record<string, unknown>) => {
    const result = envSchema.safeParse(config);
    if (!result.success) {
      throw new Error(`Environment validation failed: ${result.error.message}`);
    }
    return result.data;
  },
};
