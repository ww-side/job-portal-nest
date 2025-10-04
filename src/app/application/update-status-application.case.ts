import { ApplicationEntity } from '~/core/application/application.entity';
import { ApplicationRepository } from '~/core/application/application.repository';
import { CompanyRepository } from '~/core/company/company.repository';
import { ForbiddenException } from '~/core/errors/forbidden';
import { NotFoundException } from '~/core/errors/not-found';
import { JobRepository } from '~/core/job/job.repository';

export class UpdateApplicationStatusUseCase {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly jobRepository: JobRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute({
    applicationId,
    newStatusId,
    currentUserId,
  }: {
    applicationId: string;
    newStatusId: string;
    currentUserId: string;
  }): Promise<ApplicationEntity> {
    const application = await this.applicationRepository.get(applicationId);
    if (!application) {
      throw new NotFoundException(
        `Application with id ${applicationId} not found`,
      );
    }

    const job = await this.jobRepository.get(application.jobId);
    if (!job) {
      throw new NotFoundException(`Job with id ${application.jobId} not found`);
    }

    const company = await this.companyRepository.get(job.companyId);
    if (!company) {
      throw new NotFoundException(`Company with id ${job.companyId} not found`);
    }

    if (company.ownerId !== currentUserId) {
      throw new ForbiddenException(
        'Only the company owner can update application status',
      );
    }

    return await this.applicationRepository.update(applicationId, {
      statusId: newStatusId,
    });
  }
}
