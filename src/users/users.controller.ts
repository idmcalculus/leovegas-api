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
  ApiBody,
  ApiParam,
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

  @Post()
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

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

  @Get(':id')
  @ApiParam({ name: 'id', type: 'number', description: 'The user ID' })
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

  @Put(':id')
  @ApiParam({ name: 'id', type: 'number', description: 'The user ID' })
  @ApiBody({ type: UpdateUserDto })
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

  @Roles(Role.Admin)
  @Delete(':id')
  @ApiParam({ name: 'id', type: 'number', description: 'The user ID' })
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
