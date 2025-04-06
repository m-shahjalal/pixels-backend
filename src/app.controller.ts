import { Controller, Get } from '@nestjs/common';
import { AppConfigService } from './config/config.service';

@Controller()
export class AppController {
  constructor(private configService: AppConfigService) {}

  @Get()
  getRoot() {
    // Using typed config service
    const appConfig = this.configService.get('app');

    return {
      name: 'Alysia Backend API',
      version: '1.0.0',
      config: appConfig,
      message: 'Welcome to the Alysia Backend API',
      docs: `/docs`,
    };
  }

  @Get('ping')
  ping() {
    return {
      message: 'pong 🔔',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'healthy',
      uptime: `${process.uptime().toFixed(2)} seconds`,
      timestamp: new Date().toISOString(),
    };
  }
}
