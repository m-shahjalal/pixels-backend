import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { RequestContext } from './utils/request-context/request-context.dto';
import { CreateUserInput } from './modules/user/dtos/user-create-input.dto';
import { UserService } from './modules/user/services/user.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const configService = app.get(ConfigService);
  const defaultAdminUserPassword = configService.get<string>('pass@123')!;

  const userService = app.get(UserService);

  const defaultAdmin: CreateUserInput = {
    firstName: 'Default Admin User',
    lastName: 'Admin',
    password: defaultAdminUserPassword,
    email: 'default@admin.com',
  };

  const ctx = new RequestContext();

  // Create the default admin user if it doesn't already exist.
  const user = await userService.findByUsername(ctx, defaultAdmin.email);
  if (!user) {
    await userService.createUser(ctx, defaultAdmin);
  }

  await app.close();
}
bootstrap();
