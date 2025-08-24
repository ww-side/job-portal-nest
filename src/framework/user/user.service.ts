import { Injectable } from '@nestjs/common';

import { CreateUserUseCase } from '~/application/user/create-user.use-case';
import { DeleteUserUseCase } from '~/application/user/delete-user.use-case';
import { UpdateUserUseCase } from '~/application/user/update-user.use-case';

import { CreateUserDTO } from '~/framework/user/dto/create-user';

import { UpdateUserDTO } from './dto/update-user';

@Injectable()
export class UsersService {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
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

  async update(id: string, dto: UpdateUserDTO) {
    return this.updateUserUseCase.execute(id, {
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      password: dto.password,
      phone: dto.phone,
    });
  }

  async delete(id: string) {
    return this.deleteUserUseCase.execute(id);
  }
}
