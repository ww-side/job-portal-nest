import { Injectable } from '@nestjs/common';

import { LoginDTO } from './dto/login';
import { LogoutDTO } from './dto/logout';
import { RefreshTokenDTO } from './dto/refresh-token';
import { LoginUserUseCase } from '~/app/auth/login.case';
import { LogoutUserUseCase } from '~/app/auth/logout.case';
import { RefreshTokenUseCase } from '~/app/auth/refresh-token.case';

@Injectable()
export class AuthService {
  constructor(
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUserUseCase: LogoutUserUseCase,
  ) {}

  async login(dto: LoginDTO) {
    return this.loginUserUseCase.execute(dto.email, dto.password);
  }

  async refreshToken(dto: RefreshTokenDTO) {
    return this.refreshTokenUseCase.execute(dto.refreshToken);
  }

  async logout(dto: LogoutDTO) {
    return this.logoutUserUseCase.execute(dto.token);
  }
}
