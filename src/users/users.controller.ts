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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { UserDto } from './dto/user.dto';

export class RemoveUserResponse {
  success: boolean;
}

@ApiBearerAuth()
@ApiTags('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /*
   * Create a new user
   */
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Roles(Role.Admin)
  @Get()
  async findAll(@Req() req: Request & { user: any }) {
    return this.usersService.findAll(req.user);
  }

  @Get(':id')
  async findOne(@Req() req: Request & { user: any }, @Param('id') id: string) {
    return this.usersService.findOne(req.user, +id);
  }

  @Put(':id')
  async update(
    @Req() req: Request & { user: any },
    @Param('id') id: string,
    @Body() updateDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(req.user, +id, updateDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Req() req: Request & { user: any }, @Param('id') id: string) {
    return this.usersService.removeUser(req.user, +id);
  }
}
