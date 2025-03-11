import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { UserState } from '../user.entity';

export class UserOutput {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  firstName: string;

  @Expose()
  @ApiProperty()
  lastName: string;

  @Expose()
  @ApiProperty()
  username: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty({
    enum: UserState,
    enumName: 'UserState',
    description: 'User account state',
    example: UserState.ACTIVE,
    examples: [
      UserState.ACTIVE,
      UserState.DEACTIVATED,
      UserState.BLOCKED,
      UserState.PENDING,
    ],
  })
  state: UserState;

  @Expose()
  @ApiProperty()
  createdAt: string;

  @Expose()
  @ApiProperty()
  updatedAt: string;
}
