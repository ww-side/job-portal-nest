import {
  ApplicationRepository,
  UpdateApplicationData,
} from '~/core/application/application.repository';
import { CompanyRepository } from '~/core/company/company.repository';
import { ForbiddenException } from '~/core/errors/forbidden';
import { NotFoundException } from '~/core/errors/not-found';
import { JobRepository } from '~/core/job/job.repository';

export class UpdateApplicationUseCase {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private readonly jobRepository: JobRepository,
    private readonly companyRepository: CompanyRepository,
  ) {}

  async execute({
    id,
    data,
    currentUserId,
    jobId,
  }: {
    id: string;
    data: UpdateApplicationData;
    currentUserId: string;
    jobId: string;
  }) {
    const application = await this.applicationRepository.get(id);
    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }

    const job = await this.jobRepository.get(jobId);
    if (!job) {
      throw new NotFoundException(`Job with id ${jobId} not found`);
    }

    const company = await this.companyRepository.get(job.companyId);
    if (!company) {
      throw new NotFoundException(`Company with id ${job.companyId} not found`);
    }

    const isApplicationOwner = application.userId === currentUserId;

    if (!isApplicationOwner) {
      throw new ForbiddenException(
        'You are not allowed to update this application',
      );
    }

    if (isApplicationOwner && 'statusId' in data) {
      throw new ForbiddenException(
        'You cannot edit the status of an application',
      );
    }

    return await this.applicationRepository.update(id, data);
  }
}
