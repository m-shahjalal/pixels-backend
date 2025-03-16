import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ROLE } from '../../../common/constants';

export class UserOutput {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  firstName: string;

  @Expose()
  @ApiProperty()
  lastName: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty({
    enum: ROLE,
    enumName: 'ROLE',
    description: 'User role',
    example: ROLE.USER,
    examples: [ROLE.USER, ROLE.ADMIN],
  })
  role: ROLE;

  @Expose()
  @ApiProperty()
  createdAt: string;

  @Expose()
  @ApiProperty()
  updatedAt: string;
}
