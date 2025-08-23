import { Injectable } from '@nestjs/common';
import { CreateUserUseCase } from '~/application/user/create-user.use-case';
import { LoginUserUseCase } from '~/application/auth/login.use-case';
import { RefreshTokenUseCase } from '~/application/auth/refresh-token.use-case';
import { CreateUserDTO } from '~/framework/user/dto/create-user';
import { LoginDTO } from '~/framework/user/dto/login';
import { RefreshTokenDTO } from '~/framework/user/dto/refresh-token';

@Injectable()
export class UsersService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  async create(dto: CreateUserDTO) {
    return this.createUserUseCase.execute({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: dto.password,
      phone: dto.phone,
      roleId: dto.roleId,
    });
  }

  async login(dto: LoginDTO) {
    return this.loginUserUseCase.execute(dto.email, dto.password);
  }

  async refreshToken(dto: RefreshTokenDTO) {
    return this.refreshTokenUseCase.execute(dto.refreshToken);
  }
}
