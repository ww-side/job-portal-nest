import { CompanyRepository } from '~/core/company/company.repository';
import { NotFoundException } from '~/core/errors/not-found';
import { JobRepository } from '~/core/job/job.repository';

interface GetJobUseCaseDeps {
  jobRepository: JobRepository;
  companyRepository: CompanyRepository;
}

export class GetJobUseCase {
  constructor(private readonly deps: GetJobUseCaseDeps) {}

  async execute(id: string) {
    const { jobRepository, companyRepository } = this.deps;

    const job = await jobRepository.get(id);

    if (!job) {
      throw new NotFoundException('Job not found');
    }

    const company = await companyRepository.get(job.companyId);

    if (!company) {
      throw new NotFoundException('Company that posted the job not found');
    }

    return job;
  }
}
