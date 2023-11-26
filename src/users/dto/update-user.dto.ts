import {
  IsEmail,
  IsOptional,
  IsString,
  IsEnum,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../roles/role.enum';

export class UpdateUserDto {
  @ApiProperty({ description: 'Full name of the user', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Email address of the user',
    required: false,
    format: 'email',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Password for the user account',
    required: false,
    minLength: 8,
  })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  @ApiProperty({ description: 'Role of the user', required: false, enum: Role })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  @ApiProperty({ description: 'Access token for the user', required: false })
  @IsOptional()
  @IsString()
  access_token?: string;
}
