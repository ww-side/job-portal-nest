import { NotFoundException } from '~/core/errors/not-found';
import { UserEntity } from '~/core/user/user.entity';
import type { UserRepository } from '~/core/user/user.repository';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(id);
    return user;
  }
}
