import { CompanyRepository } from '~/core/company/company.repository';
import { ForbiddenException } from '~/core/errors/forbidden';
import { NotFoundException } from '~/core/errors/not-found';
import { CreateJobData, JobRepository } from '~/core/job/job.repository';

interface CreateJobUseCaseDeps {
  jobRepository: JobRepository;
  companyRepository: CompanyRepository;
}

export class CreateJobUseCase {
  constructor(private readonly deps: CreateJobUseCaseDeps) {}

  async execute(data: CreateJobData & { createdByUserId: string }) {
    const { jobRepository, companyRepository } = this.deps;

    const company = await companyRepository.get(data.companyId);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const isOwner = company.ownerId === data.createdByUserId;
    const isRecruiter = company.recruiterIds.includes(data.createdByUserId);

    if (!isOwner && !isRecruiter) {
      throw new ForbiddenException(
        'You are not allowed to create jobs for this company',
      );
    }

    return await jobRepository.create({
      title: data.title,
      description: data.description,
      companyId: data.companyId,
      location: data.location,
      salaryMin: data.salaryMin,
      salaryMax: data.salaryMax,
      statusId: data.statusId,
      typeId: data.typeId,
      skills: data.skills ?? [],
    });
  }
}
