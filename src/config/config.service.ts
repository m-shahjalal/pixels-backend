import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEY } from './config';
import { Config, Path, PathValue } from './config';
import { DataSourceOptions } from 'typeorm';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  public get<P extends Path<Config>>(path: P): PathValue<Config, P> {
    return this.configService.get<PathValue<Config, P>>(
      `${CONFIG_KEY}.${path}`,
    );
  }

  public get app() {
    return {
      port: this.configService.get<number>(`${CONFIG_KEY}.app.port`),
      env: this.configService.get<string>(`${CONFIG_KEY}.app.env`),
      apiPrefix: this.configService.get<string>(`${CONFIG_KEY}.app.apiPrefix`),
    };
  }

  public get databaseConfig(): DataSourceOptions {
    return {
      type: 'postgres',
      host: this.configService.get('DB_HOST', 'localhost'),
      port: this.configService.get('DB_PORT', 5432),
      username: this.configService.get('DB_USERNAME', 'postgres'),
      password: this.configService.get('DB_PASSWORD', 'postgres'),
      database: this.configService.get('DB_NAME', 'alysia'),
      entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
      migrations: ['./database/migrations/*.ts'],
      migrationsRun: true,
      synchronize: this.configService.get('APP_ENV') !== 'production',
      logging: this.configService.get('APP_ENV') !== 'production',
    };
  }

  public get jwt() {
    return {
      secret: this.configService.get<string>(`${CONFIG_KEY}.jwt.secret`),
      expiration: this.configService.get<string>(`${CONFIG_KEY}.jwt.expiresIn`),
      refreshSecret: this.configService.get<string>(
        `${CONFIG_KEY}.jwt.refreshSecret`,
      ),
      refreshExpiration: this.configService.get<string>(
        `${CONFIG_KEY}.jwt.refreshExpiresIn`,
      ),
    };
  }
}
