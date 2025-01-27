import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces';
import { validationSchema } from './env-schema';

import configuration from './configuration';

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
