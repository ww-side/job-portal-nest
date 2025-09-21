import { JobEntity } from '~/core/job/job.entity';

import { mockJobRepository } from '~/test/mocks/repositories';

import { GetJobsUseCase } from './get-jobs.case';

describe('GetJobsUseCase', () => {
  let jobRepository: typeof mockJobRepository;
  let getJobsUseCase: GetJobsUseCase;

  let job1: JobEntity;
  let job2: JobEntity;

  beforeEach(() => {
    jobRepository = mockJobRepository;
    getJobsUseCase = new GetJobsUseCase(jobRepository);

    job1 = new JobEntity({
      id: 'job-1',
      title: 'Backend Developer',
      description: 'API development',
      companyId: 'company-1',
      location: 'Remote',
      salaryMin: 4000,
      salaryMax: 7000,
      statusId: 'status-1',
      typeId: 'type-1',
      skills: ['Node.js'],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    job2 = new JobEntity({
      id: 'job-2',
      title: 'Frontend Developer',
      description: 'React development',
      companyId: 'company-2',
      location: 'Remote',
      salaryMin: 3500,
      salaryMax: 6500,
      statusId: 'status-1',
      typeId: 'type-2',
      skills: ['React'],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });

  it('returns jobs with pagination when no filters provided', async () => {
    jobRepository.getAll.mockResolvedValue({
      data: [job1, job2],
      totalItems: 2,
      totalPages: 1,
      currentPage: 1,
      pageSize: 20,
    });

    const result = await getJobsUseCase.execute();

    expect(result.data).toEqual([job1, job2]);
    expect(result.totalItems).toBe(2);
    expect(result.totalPages).toBe(1);
    expect(jobRepository.getAll.mock.calls[0][0]).toEqual({
      ids: undefined,
      companyId: undefined,
      page: undefined,
      pageSize: undefined,
    });
  });

  it('filters jobs by companyId if provided', async () => {
    jobRepository.getAll.mockResolvedValue({
      data: [job1],
      totalItems: 1,
      totalPages: 1,
      currentPage: 1,
      pageSize: 20,
    });

    const result = await getJobsUseCase.execute({ companyId: 'company-1' });

    expect(result.data).toEqual([job1]);
    expect(jobRepository.getAll.mock.calls[0][0]).toEqual({
      companyId: 'company-1',
      ids: undefined,
      page: undefined,
      pageSize: undefined,
    });
  });

  it('applies ids filter if provided', async () => {
    jobRepository.getAll.mockResolvedValue({
      data: [job1],
      totalItems: 1,
      totalPages: 1,
      currentPage: 1,
      pageSize: 20,
    });

    const result = await getJobsUseCase.execute({ ids: ['job-1'] });

    expect(result.data).toEqual([job1]);
    expect(jobRepository.getAll.mock.calls[0][0]).toEqual({
      ids: ['job-1'],
      companyId: undefined,
      page: undefined,
      pageSize: undefined,
    });
  });

  it('applies pagination options correctly', async () => {
    jobRepository.getAll.mockResolvedValue({
      data: [job1],
      totalItems: 10,
      totalPages: 2,
      currentPage: 2,
      pageSize: 5,
    });

    const result = await getJobsUseCase.execute({ page: 2, pageSize: 5 });

    expect(result.data).toEqual([job1]);
    expect(result.totalItems).toBe(10);
    expect(result.totalPages).toBe(2);
    expect(result.currentPage).toBe(2);
    expect(result.pageSize).toBe(5);
    expect(jobRepository.getAll.mock.calls[0][0]).toEqual({
      ids: undefined,
      companyId: undefined,
      page: 2,
      pageSize: 5,
    });
  });
});
