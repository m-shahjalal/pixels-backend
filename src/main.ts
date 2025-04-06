import '../register-paths';

console.log('Starting NestJS application...');

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CONFIG_KEY } from './config/config';
import { customOptions, swaggerConfig } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService).get(CONFIG_KEY);
  const { port, apiPrefix } = config.app;

  app.setGlobalPrefix(apiPrefix);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, customOptions);

  await app.listen(port);
  console.info(`🚀🚀 http://localhost:${port}/${apiPrefix}`);
}

bootstrap();
