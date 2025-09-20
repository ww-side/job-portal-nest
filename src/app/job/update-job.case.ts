import { ForbiddenException } from '@nestjs/common';

import { CompanyRepository } from '~/core/company/company.repository';
import { NotFoundException } from '~/core/errors/not-found';
import { JobEntity } from '~/core/job/job.entity';
import type { JobRepository, UpdateJobData } from '~/core/job/job.repository';

interface UpdateJobUseCaseDeps {
  jobRepository: JobRepository;
  companyRepository: CompanyRepository;
}

export class UpdateJobUseCase {
  constructor(private readonly deps: UpdateJobUseCaseDeps) {}

  async execute(
    jobId: string,
    userId: string,
    data: UpdateJobData,
  ): Promise<JobEntity> {
    const { jobRepository, companyRepository } = this.deps;

    const job = await jobRepository.findById(jobId);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const company = await companyRepository.findById(job.companyId);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const isOwner = company.ownerId === userId;
    const isRecruiter = company.recruiterIds.includes(userId);

    if (!isOwner && !isRecruiter) {
      throw new ForbiddenException('You are not allowed to update this job');
    }

    return await jobRepository.update(jobId, data);
  }
}
