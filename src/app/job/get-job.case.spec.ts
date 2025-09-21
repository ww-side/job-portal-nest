import { CompanyRepository } from '~/core/company/company.repository';
import { NotFoundException } from '~/core/errors/not-found';
import { JobEntity } from '~/core/job/job.entity';
import { JobRepository } from '~/core/job/job.repository';

import {
  mockCompanyRepository,
  mockJobRepository,
} from '~/test/mocks/repositories';

import { GetJobUseCase } from './get-job.case';

describe('GetJobUseCase', () => {
  let jobRepository: jest.Mocked<JobRepository>;
  let companyRepository: jest.Mocked<CompanyRepository>;
  let getJobUseCase: GetJobUseCase;

  beforeEach(() => {
    jobRepository = mockJobRepository;
    companyRepository = mockCompanyRepository;

    getJobUseCase = new GetJobUseCase({
      jobRepository,
      companyRepository,
    });
  });

  it('returns a job if job and company exist', async () => {
    const job: JobEntity = {
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
      updateInfo: jest.fn(),
      addSkill: jest.fn(),
      removeSkill: jest.fn(),
    };

    const company = {
      id: 'company-1',
      name: 'Acme Corp',
      ownerId: 'owner-1',
      recruiterIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      addRecruiter: jest.fn(),
      removeRecruiter: jest.fn(),
      updateInfo: jest.fn(),
    };

    jobRepository.get.mockResolvedValue(job);
    companyRepository.get.mockResolvedValue(company);

    const result = await getJobUseCase.execute('job-1');

    expect(result).toEqual(job);
    expect(jobRepository.get.mock.calls[0][0]).toBe('job-1');
    expect(companyRepository.get.mock.calls[0][0]).toBe('company-1');
  });

  it('throws NotFoundException if job does not exist', async () => {
    jobRepository.get.mockResolvedValue(null);
    companyRepository.get.mockClear();

    await expect(getJobUseCase.execute('job-1')).rejects.toThrow(
      NotFoundException,
    );

    expect(jobRepository.get.mock.calls[0][0]).toBe('job-1');
    expect(companyRepository.get.mock.calls).toHaveLength(0);
  });

  it('throws NotFoundException if company does not exist', async () => {
    const job: JobEntity = {
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
      updateInfo: jest.fn(),
      addSkill: jest.fn(),
      removeSkill: jest.fn(),
    };

    jobRepository.get.mockResolvedValue(job);
    companyRepository.get.mockResolvedValue(null);

    await expect(getJobUseCase.execute('job-1')).rejects.toThrow(
      NotFoundException,
    );

    expect(jobRepository.get.mock.calls[0][0]).toBe('job-1');
    expect(companyRepository.get.mock.calls[0][0]).toBe('company-1');
  });
});
