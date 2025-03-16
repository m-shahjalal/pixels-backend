import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CONFIG_KEY } from './config';
import { Config, Path, PathValue } from './config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  public get<P extends Path<Config>>(path: P): PathValue<Config, P> {
    return this.configService.get<PathValue<Config, P>>(
      `${CONFIG_KEY}.${path}`,
    );
  }

  // Typed getters for common configurations
  public get app() {
    return {
      port: this.configService.get<number>(`${CONFIG_KEY}.app.port`),
      env: this.configService.get<string>(`${CONFIG_KEY}.app.env`),
      apiPrefix: this.configService.get<string>(`${CONFIG_KEY}.app.apiPrefix`),
    };
  }

  public get database() {
    return {
      host: this.configService.get<string>(`${CONFIG_KEY}.database.host`),
      port: this.configService.get<number>(`${CONFIG_KEY}.database.port`),
      username: this.configService.get<string>(
        `${CONFIG_KEY}.database.username`,
      ),
      password: this.configService.get<string>(
        `${CONFIG_KEY}.database.password`,
      ),
      database: this.configService.get<string>(
        `${CONFIG_KEY}.database.database`,
      ),
      synchronize: this.configService.get<boolean>(
        `${CONFIG_KEY}.database.synchronize`,
      ),
      logging: this.configService.get<boolean>(
        `${CONFIG_KEY}.database.logging`,
      ),
      ssl: this.configService.get<boolean>(`${CONFIG_KEY}.database.ssl`),
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
