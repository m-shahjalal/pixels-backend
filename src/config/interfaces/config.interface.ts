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
  logging: boolean;
  autoLoadEntities: boolean;
  ssl: boolean;
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
