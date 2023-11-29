import { Controller, Post, Body } from '@nestjs/common';
import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './dto/login.dto';

export class loginResponse {
  @ApiProperty()
  access_token: string;
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully logged in.',
    type: loginResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async login(@Body() body: LoginDto) {
    return this.authService.validateUser(body.email, body.password);
  }
}
