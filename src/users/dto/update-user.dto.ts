import {
  IsEmail,
  IsOptional,
  IsString,
  IsEnum,
  MinLength,
} from 'class-validator';
import { Role } from '../roles/role.enum';

export class UpdateUserDto {
  /*
   * Full name of the user
   * @example John Doe
   */
  @IsOptional()
  @IsString()
  name?: string;

  /*
   * Email of the user
   * @example user@email.com
   */
  @IsOptional()
  @IsEmail()
  email?: string;

  /*
   * Password for the user account
   * @example 12345678
   */
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;

  /*
   * Role of the user
   * @example USER
   */
  @IsOptional()
  @IsEnum(Role)
  role?: Role;

  /*
   * Access token for the user
   * @example 12345678
   */
  @IsOptional()
  @IsString()
  access_token?: string;
}
