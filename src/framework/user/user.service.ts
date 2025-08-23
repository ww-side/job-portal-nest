import { Injectable } from '@nestjs/common';
import { CreateUserUseCase } from '~/application/user/create-user.use-case';
import { CreateUserDTO } from '~/framework/user/dto/create-user';

@Injectable()
export class UsersService {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

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
}
