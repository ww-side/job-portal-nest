import { Injectable } from '@nestjs/common';

import { CreateUserDTO, UpdateUserDTO } from './dto';
import { CreateUserUseCase } from '~/app/user/create-user.case';
import { DeleteUserUseCase } from '~/app/user/delete-user.case';
import { UpdateUserUseCase } from '~/app/user/update-user.case';

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
