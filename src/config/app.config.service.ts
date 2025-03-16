import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AppConfig,
  DatabaseConfig,
  JwtConfig,
} from './interfaces/config.interface';
import { CONFIG_KEY } from './config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get app(): AppConfig {
    return this.configService.get<AppConfig>(`${CONFIG_KEY}.app`);
  }

  get database(): DatabaseConfig {
    return this.configService.get<DatabaseConfig>(`${CONFIG_KEY}.database`);
  }

  get jwt(): JwtConfig {
    return this.configService.get<JwtConfig>(`${CONFIG_KEY}.jwt`);
  }

  get<T = any>(key: string): T {
    return this.configService.get<T>(key);
  }
}
