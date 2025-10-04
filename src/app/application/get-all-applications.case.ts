import { ForbiddenException } from '@nestjs/common';

import {
  ApplicationRepository,
  GetApplicationsFilters,
} from '~/core/application/application.repository';
import { CompanyRepository } from '~/core/company/company.repository';
import { JobRepository } from '~/core/job/job.repository';
import { UserRepository } from '~/core/user/user.repository';

import { EMPLOYER_ROLE_ID } from '~/app/config/roles';

export class GetAllApplicationsUseCase {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly jobRepository: JobRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(filters: GetApplicationsFilters & { currentUserId: string }) {
    const user = await this.userRepository.get(filters.currentUserId);

    if (user && user.roleId !== EMPLOYER_ROLE_ID) {
      throw new ForbiddenException('Only employers can view applications');
    }

    if (filters.jobId) {
      const job = await this.jobRepository.get(filters.jobId);
      if (!job) {
        throw new ForbiddenException(`Job with id ${filters.jobId} not found`);
      }

      const company = await this.companyRepository.get(job.companyId);
      if (!company || company.ownerId !== filters.currentUserId) {
        throw new ForbiddenException(
          'You cannot view applications for jobs outside your company',
        );
      }
    }

    return await this.applicationRepository.getAll(filters);
  }
}
