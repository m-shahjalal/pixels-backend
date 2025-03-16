/// <reference types="node" />
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { CONFIG_KEY, DatabaseConfig } from './config/config';

@Injectable()
export class TypeOrmService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return this.configService.get<DatabaseConfig>(`${CONFIG_KEY}.database`);
  }
}
