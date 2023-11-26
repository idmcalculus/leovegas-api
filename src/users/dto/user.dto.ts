import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  // Do not expose passwords in the API!
  // password: string; // This should not be included in the UserDto

  @ApiProperty({ example: 'USER' })
  role: string;

  // Typically you also do not expose access tokens in such DTOs
  // access_token?: string; // This should probably not be included in the UserDto

  @ApiProperty({ example: '2023-11-26T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2023-11-26T00:00:00.000Z' })
  updatedAt: Date;
}
