import { Body, Controller, Headers, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '~/framework/shared/guards/jwt-auth';

import { LoginDoc, LogoutDoc, RefreshTokenDoc } from './auth.docs';
import { AuthService } from './auth.service';
import { LoginDTO, RefreshTokenDTO } from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @LoginDoc()
  async login(@Body() dto: LoginDTO) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @RefreshTokenDoc()
  async refreshToken(@Body() dto: RefreshTokenDTO) {
    return this.authService.refreshToken(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @LogoutDoc()
  async logout(@Headers('authorization') token: string) {
    return this.authService.logout({ token: token.replace('Bearer ', '') });
  }
}
