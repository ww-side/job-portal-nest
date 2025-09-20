import { CompanyRepository } from '~/core/company/company.repository';
import { ForbiddenException } from '~/core/errors/forbidden';
import { NotFoundException } from '~/core/errors/not-found';
import { JobEntity } from '~/core/job/job.entity';
import type { JobRepository } from '~/core/job/job.repository';

interface DeleteJobUseCaseDeps {
  jobRepository: JobRepository;
  companyRepository: CompanyRepository;
}

export class DeleteJobUseCase {
  constructor(private readonly deps: DeleteJobUseCaseDeps) {}

  async execute(jobId: string, userId: string): Promise<JobEntity> {
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
      throw new ForbiddenException('You are not allowed to delete this job');
    }

    return await jobRepository.delete(jobId);
  }
}
