import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
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

  @Get('paginated')
  getPaginated() {
    return {
      data: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ],
      meta: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    };
  }

  @Get('error')
  getError() {
    throw new HttpException('Test error message', HttpStatus.BAD_REQUEST);
  }
}
