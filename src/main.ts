import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CONFIG_KEY } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService).get(CONFIG_KEY);

  // Global prefix
  app.setGlobalPrefix(config.app.apiPrefix);

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Alysia API')
    .setDescription('The Alysia API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // CORS
  app.enableCors();
  // Start the server
  await app.listen(config.app.port);
  console.info(
    `🚀🚀 http://localhost:${config.app.port}/${config.app.apiPrefix}`,
  );
}
bootstrap();
