import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtAuthStrategy } from '../../auth/strategies/jwt-auth.strategy';
import { SharedModule } from '../../shared/shared.module';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './services/user.service';
import { UserAclService } from './services/user-acl.service';
import { UserRepository } from './user.repository';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([User])],
  providers: [UserService, JwtAuthStrategy, UserAclService, UserRepository],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
