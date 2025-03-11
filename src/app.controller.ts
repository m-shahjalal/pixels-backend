import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { AppLogger } from './shared/logger/logger.service';

@Controller()
export class AppController {
  constructor(
    private readonly logger: AppLogger,
    private readonly appService: AppService,
  ) {
    this.logger.setContext(AppController.name);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
