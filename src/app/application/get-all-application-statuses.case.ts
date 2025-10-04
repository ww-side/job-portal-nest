import { ApplicationStatusRepository } from '~/core/application/application.repository';

export class GetAllApplicationStatusesUseCase {
  constructor(
    private readonly applicationStatusRepository: ApplicationStatusRepository,
  ) {}

  async execute() {
    return await this.applicationStatusRepository.getAll();
  }
}
