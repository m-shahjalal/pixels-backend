import { Injectable } from '@nestjs/common';
import { UserService } from '../modules/user/services/user.service';
import { CreateUserDto } from '../modules/user/dto/create-user.dto';

@Injectable()
export class CliService {
  constructor(private readonly userService: UserService) {}

  async createDefaultAdmin(): Promise<void> {
    const defaultAdmin: CreateUserDto = {
      email: 'admin@example.com',
      password: 'admin123',
      firstName: 'Default',
      lastName: 'Admin',
    };

    const existingUser = await this.userService.findByEmail(defaultAdmin.email);
    if (!existingUser) {
      await this.userService.create(defaultAdmin);
      console.info('Default admin user created');
    } else {
      console.info('Default admin user already exists');
    }
  }
}
