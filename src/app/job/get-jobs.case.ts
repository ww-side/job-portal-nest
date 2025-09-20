import { JobRepository } from '~/core/job/job.repository';

interface GetJobsOptions {
  ids?: string[];
  companyId?: string;
  page?: number;
  pageSize?: number;
}

export class GetJobsUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(options?: GetJobsOptions) {
    return await this.jobRepository.getAll({
      ids: options?.ids,
      companyId: options?.companyId,
      page: options?.page,
      pageSize: options?.pageSize,
    });
  }
}
