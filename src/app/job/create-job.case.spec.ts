import { CompanyEntity } from '~/core/company/company.entity';
import { CompanyRepository } from '~/core/company/company.repository';
import { ForbiddenException } from '~/core/errors/forbidden';
import { NotFoundException } from '~/core/errors/not-found';
import { JobEntity } from '~/core/job/job.entity';
import { JobRepository } from '~/core/job/job.repository';

import { CreateJobUseCase } from './create-job.case';
import { mockCompanyRepository, mockJobRepository } from '~/test/repositories';

describe('CreateJobUseCase', () => {
  let jobRepository: jest.Mocked<JobRepository>;
  let companyRepository: jest.Mocked<CompanyRepository>;
  let createJobUseCase: CreateJobUseCase;

  beforeEach(() => {
    jobRepository = mockJobRepository;
    companyRepository = mockCompanyRepository;

    createJobUseCase = new CreateJobUseCase({
      jobRepository,
      companyRepository,
    });
  });

  it('creates a job successfully if user is owner', async () => {
    const company: CompanyEntity = {
      id: 'company-1',
      name: 'Acme Corp',
      ownerId: 'user-1',
      recruiterIds: ['user-2'],
      createdAt: new Date(),
      updatedAt: new Date(),
      addRecruiter: jest.fn(),
      removeRecruiter: jest.fn(),
      updateInfo: jest.fn(),
    };

    const jobData = {
      title: 'Frontend Developer',
      description: 'Job description',
      companyId: 'company-1',
      location: 'Remote',
      salaryMin: 5000,
      salaryMax: 8000,
      statusId: '1',
      typeId: '2',
      skills: ['React', 'Node.js'],
      createdByUserId: 'user-1',
    };

    const createdJob: JobEntity = {
      ...jobData,
      id: 'job-1',
      createdAt: new Date(),
      updatedAt: new Date(),
      updateInfo: jest.fn(),
      addSkill: jest.fn(),
      removeSkill: jest.fn(),
    };

    companyRepository.get.mockResolvedValue(company);
    jobRepository.create.mockResolvedValue(createdJob);

    const result = await createJobUseCase.execute(jobData);

    expect(result).toEqual(createdJob);
    expect(companyRepository.get.mock.calls[0][0]).toBe('company-1');
    expect(jobRepository.create.mock.calls[0][0]).toEqual({
      title: 'Frontend Developer',
      description: 'Job description',
      companyId: 'company-1',
      location: 'Remote',
      salaryMin: 5000,
      salaryMax: 8000,
      statusId: '1',
      typeId: '2',
      skills: ['React', 'Node.js'],
    });
  });

  it('throws NotFoundException if company does not exist', async () => {
    companyRepository.get.mockResolvedValue(null);

    const jobData = {
      title: 'Frontend Developer',
      description: 'Job description',
      companyId: 'company-1',
      location: 'Remote',
      salaryMin: 5000,
      salaryMax: 8000,
      statusId: '1',
      typeId: '2',
      skills: ['React', 'Node.js'],
      createdByUserId: 'user-1',
    };

    await expect(createJobUseCase.execute(jobData)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws ForbiddenException if user is not owner or recruiter', async () => {
    const company: CompanyEntity = {
      id: 'company-1',
      name: 'Acme Corp',
      ownerId: 'owner-1',
      recruiterIds: ['recruiter-1'],
      createdAt: new Date(),
      updatedAt: new Date(),
      addRecruiter: jest.fn(),
      removeRecruiter: jest.fn(),
      updateInfo: jest.fn(),
    };

    companyRepository.get.mockResolvedValue(company);

    const jobData = {
      title: 'Frontend Developer',
      description: 'Job description',
      companyId: 'company-1',
      location: 'Remote',
      salaryMin: 5000,
      salaryMax: 8000,
      statusId: '1',
      typeId: '2',
      skills: ['React', 'Node.js'],
      createdByUserId: 'user-999',
    };

    await expect(createJobUseCase.execute(jobData)).rejects.toThrow(
      ForbiddenException,
    );
  });
});
