import { Injectable } from '@nestjs/common';

import { LoginUserUseCase } from '~/application/auth/login.use-case';
import { RefreshTokenUseCase } from '~/application/auth/refresh-token.use-case';

import { LoginDTO } from './dto/login';
import { RefreshTokenDTO } from './dto/refresh-token';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  async login(dto: LoginDTO) {
    return this.loginUserUseCase.execute(dto.email, dto.password);
  }

  async refreshToken(dto: RefreshTokenDTO) {
    return this.refreshTokenUseCase.execute(dto.refreshToken);
  }
}
