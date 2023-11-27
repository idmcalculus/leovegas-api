export class UserDto {
  /*
   * ID of the user
   * @example 1
   */
  id: number;

  /*
   * Full name of the user
   * @example John Doe
   */
  name: string;

  /*
   * Email of the user
   * @example user@email.com
   */
  email: string;

  /*
   * Role of the user
   * @example USER
   */
  role: string;

  /*
   * Date when the user was created
   * @example 2023-11-26T00:00:00.000Z
   */
  createdAt: Date;

  /*
   * Date when the user was updated
   * @example 2023-11-26T00:00:00.000Z
   */
  updatedAt: Date;
}
