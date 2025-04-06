import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CONFIG_KEY } from './config/config';
import { customOptions, swaggerConfig } from './config/swagger.config';
import { Express, Request, Response } from 'express';

let app: any;
let expressApp: Express;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService).get(CONFIG_KEY);
    const { apiPrefix } = config.app;
    app.enableCors();

    app.setGlobalPrefix(apiPrefix, {
      exclude: ['/ping', '/health', '/docs', '/'],
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document, customOptions);

    await app.init();
    expressApp = app.getHttpAdapter().getInstance();
    console.info(`🚀🚀 Application initialized successfully`);
  }
  return expressApp;
}

// This is the handler function for Vercel
export default async function handler(req: Request, res: Response) {
  const app = await bootstrap();
  return app(req, res);
}

// If running in non-serverless environment (like local development)
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then((app) => {
    const server = app.listen(process.env.PORT || 4000, () => {
      console.info(
        `🚀🚀 Server running on http://localhost:${process.env.PORT || 4000}`,
      );
    });

    // Handle shutdown gracefully
    process.on('SIGTERM', () => {
      server.close(() => {
        console.info('Server closed');
      });
    });
  });
}
