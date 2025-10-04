import { ApplicationRepository } from '~/core/application/application.repository';
import { ForbiddenException } from '~/core/errors/forbidden';
import { NotFoundException } from '~/core/errors/not-found';

export class DeleteApplicationUseCase {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  async execute(id: string, currentUserId: string) {
    const application = await this.applicationRepository.get(id);

    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }

    if (application.userId !== currentUserId) {
      throw new ForbiddenException('You can only delete your own applications');
    }

    return await this.applicationRepository.delete(id);
  }
}
