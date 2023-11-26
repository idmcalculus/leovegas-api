import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../roles/role.enum';

export class CreateUserDto {
  @ApiProperty({ description: 'Full name of the user' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email address of the user', format: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Password for the user account', minLength: 8 })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: 'Role of the user', enum: Role })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({ description: 'Access token for the user' })
  @IsNotEmpty()
  @IsString()
  access_token: string;
}
