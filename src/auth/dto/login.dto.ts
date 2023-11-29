import { IsString } from 'class-validator';

export class LoginDto {
  /*
   * Email of the user
   * @example user@email.com
   */
  @IsString()
  email: string;

  /*
   * Password for the user account
   * @example 12345678
   */
  @IsString()
  password: string;
}
