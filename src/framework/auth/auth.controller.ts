import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../shared/guards/jwt-auth';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login';
import { RefreshTokenDTO } from './dto/refresh-token';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Body() dto: RefreshTokenDTO) {
    return this.authService.refreshToken(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Headers('authorization') token: string) {
    return this.authService.logout({ token: token.replace('Bearer ', '') });
  }
}
