import { ConflictException } from '~/core/errors/conflict';
import { NotFoundException } from '~/core/errors/not-found';
import { HashService } from '~/core/services/hash-service';
import { UserEntity } from '~/core/user/user.entity';
import type {
  UpdateUserData,
  UserRepository,
} from '~/core/user/user.repository';

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
  ) {}

  async execute(
    userIdFromToken: string,
    data: UpdateUserData,
  ): Promise<UserEntity> {
    const user = await this.userRepository.get(userIdFromToken);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepository.getByEmail(data.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    let hashedPassword = user.password;
    if (data.password) {
      hashedPassword = await this.hashService.hash(data.password, 10);
    }

    const updatedUser = await this.userRepository.update(userIdFromToken, {
      ...data,
      password: hashedPassword,
    });

    return updatedUser;
  }
}
