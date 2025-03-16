/// <reference types="node" />
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DatabaseConfig } from './interfaces/config.interface';
import { CONFIG_KEY } from './config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const dbConfig = this.configService.get<DatabaseConfig>(
      `${CONFIG_KEY}.database`,
    );

    // Debug log
    console.log('🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀Database Configuration:', {
      ...dbConfig,
      password: '***',
    });

    return dbConfig;
  }
}
