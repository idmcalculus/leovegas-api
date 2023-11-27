import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  MinLength,
} from 'class-validator';
import { Role } from '../roles/role.enum';

export class CreateUserDto {
  /*
   * Full name of the user
   * @example John Doe
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /*
   * Email of the user
   * @example user@email.com
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /*
   * Password for the user account
   * @example 12345678
   */
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  /*
   * Role of the user
   * @example USER
   */
  @IsEnum(Role)
  role: Role;

  /*
   * Access token for the user
   * @example 12345678
   */
  @IsNotEmpty()
  @IsString()
  access_token: string;
}
