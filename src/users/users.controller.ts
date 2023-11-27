import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Role } from './roles/role.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';

export class RemoveUserResponse {
  @ApiProperty({ example: true })
  success: boolean;
}

@ApiBearerAuth()
@ApiTags('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user
   * @param createUserDto - The user data to create
   * @returns The created user
   */
  @Post()
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  /**
   * Get all users (Admin only)
   * @returns An array of users
   */
  @Roles(Role.Admin)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Array of users fetched successfully',
    type: [UserDto],
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async findAll(@Req() req: Request & { user: any }) {
    return this.usersService.findAll(req.user);
  }

  /**
   * Get a user by ID
   * @param id - The ID of the user to retrieve
   * @returns The requested user
   */
  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'User fetched successfully',
    type: UserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async findOne(@Req() req: Request & { user: any }, @Param('id') id: string) {
    return this.usersService.findOne(req.user, +id);
  }

  /**
   * Update a user's information
   * @param id - The ID of the user to update
   * @param updateDto - The updated user data
   * @returns The updated user
   */
  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async update(
    @Req() req: Request & { user: any },
    @Param('id') id: string,
    @Body() updateDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(req.user, +id, updateDto);
  }

  /**
   * Delete a user by ID (Admin only)
   * @param id - The ID of the user to delete
   * @returns A success status
   */
  @Roles(Role.Admin)
  @Delete(':id')
  @ApiResponse({
    status: 200,
    description: 'User removed successfully',
    type: RemoveUserResponse,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async remove(@Req() req: Request & { user: any }, @Param('id') id: string) {
    return this.usersService.removeUser(req.user, +id);
  }
}
