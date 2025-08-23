import { ConflictException } from '@nestjs/common';

import { HashService } from '~/core/services/hash-service';
import { UserEntity } from '~/core/user/user.entity';
import { CreateUserData, UserRepository } from '~/core/user/user.repository';

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
  ) {}

  async execute(data: CreateUserData): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this.hashService.hash(data.password, 10);

    const user = await this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return user;
  }
}
