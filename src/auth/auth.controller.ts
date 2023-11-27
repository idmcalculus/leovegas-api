// auth.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in.',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async login(@Body() body: any) {
    return this.authService.validateUser(body.email, body.password);
  }
}
