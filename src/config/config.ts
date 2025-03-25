import { registerAs } from '@nestjs/config';

type StringKeys<T> = Extract<keyof T, string>;

export type Path<T> = T extends object
  ? {
      [K in StringKeys<T>]: T[K] extends object ? K | `${K}.${Path<T[K]>}` : K;
    }[StringKeys<T>]
  : never;

export type PathValue<T, P extends Path<T>> =
  P extends StringKeys<T>
    ? T[P]
    : P extends `${infer K}.${infer Rest}`
      ? K extends StringKeys<T>
        ? Rest extends Path<T[K]>
          ? PathValue<T[K], Rest>
          : never
        : never
      : never;

export function isConfigPath<T>(
  obj: T,
  path: string,
): path is Path<T> & string {
  return (
    path.split('.').reduce((acc: any, key) => {
      if (acc === undefined) return undefined;
      return acc[key];
    }, obj) !== undefined
  );
}

export interface DatabaseConfig {
  type: 'postgres';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  entities: string[];
  migrations: string[];
  synchronize: boolean;
  logging: boolean | string[];
  autoLoadEntities?: boolean;
  schema?: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshSecret: string;
  refreshExpiresIn: string;
}

export interface AppConfig {
  port: number;
  env: string;
  apiPrefix: string;
}

export interface Config {
  jwt: JwtConfig;
  app: AppConfig;
  database: DatabaseConfig;
}

export const CONFIG_KEY = 'config';

export default registerAs(
  CONFIG_KEY,
  (): Config => ({
    app: {
      port: parseInt(process.env.APP_PORT || '4000', 10),
      env: process.env.APP_ENV || 'development',
      apiPrefix: process.env.API_PREFIX || 'api',
    },
    database: {
      type: 'postgres',
      host: process.env.DB_HOST || 'pgsqldb',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'alysia',
      entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
      migrations: ['database/migrations/*{.ts,.js}'],
      synchronize: process.env.DB_SYNCHRONIZE === 'true',
      logging: JSON.parse(process.env.DB_LOGGING) || false,
      autoLoadEntities: true,
      schema: process.env.DB_SCHEMA || 'public',
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'super-secret',
      expiresIn: process.env.JWT_EXPIRATION || '1d',
      refreshSecret: process.env.JWT_REFRESH_SECRET || 'super-refresh-secret',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    },
  }),
);
