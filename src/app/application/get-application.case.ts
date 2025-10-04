import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { ApplicationRepository } from '~/core/application/application.repository';
import { CompanyRepository } from '~/core/company/company.repository';
import { JobRepository } from '~/core/job/job.repository';
import { UserRepository } from '~/core/user/user.repository';

import { EMPLOYER_ROLE_ID } from '../config/roles';

export class GetApplicationUseCase {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly jobRepository: JobRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ id, currentUserId }: { id: string; currentUserId: string }) {
    const application = await this.applicationRepository.get(id);
    const user = await this.userRepository.get(currentUserId);

    if (!application) {
      throw new NotFoundException(`Application with id #${id} not found`);
    }

    if (user && user.roleId !== EMPLOYER_ROLE_ID) {
      throw new ForbiddenException('Only employers can view this application');
    }

    const job = await this.jobRepository.get(application.jobId);
    if (!job) {
      throw new NotFoundException(
        `Job with id #${application.jobId} not found`,
      );
    }

    const company = await this.companyRepository.get(job.companyId);
    if (!company || company.ownerId !== currentUserId) {
      throw new ForbiddenException(
        'You cannot view applications for jobs outside your company',
      );
    }

    return application;
  }
}
