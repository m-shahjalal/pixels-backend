import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class LoginInput {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  password: string;
}
