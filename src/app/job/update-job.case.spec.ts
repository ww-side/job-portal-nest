import { ForbiddenException } from '@nestjs/common';

import { CompanyEntity } from '~/core/company/company.entity';
import { CompanyRepository } from '~/core/company/company.repository';
import { NotFoundException } from '~/core/errors/not-found';
import { JobEntity } from '~/core/job/job.entity';
import { JobRepository, UpdateJobData } from '~/core/job/job.repository';

import { mockCompanyRepository, mockJobRepository } from '~/test/repositories';

import { UpdateJobUseCase } from './update-job.case';

describe('UpdateJobUseCase', () => {
  let jobRepository: jest.Mocked<JobRepository>;
  let companyRepository: jest.Mocked<CompanyRepository>;
  let updateJobUseCase: UpdateJobUseCase;

  beforeEach(() => {
    jobRepository = mockJobRepository;
    companyRepository = mockCompanyRepository;

    updateJobUseCase = new UpdateJobUseCase({
      jobRepository,
      companyRepository,
    });
  });

  it('updates a job successfully if user is owner', async () => {
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

    const job: JobEntity = {
      id: 'job-1',
      title: 'Old Title',
      description: 'Old description',
      companyId: 'company-1',
      location: 'Remote',
      salaryMin: 4000,
      salaryMax: 7000,
      statusId: '1',
      typeId: '2',
      skills: ['React'],
      createdAt: new Date(),
      updatedAt: new Date(),
      updateInfo: jest.fn(),
      addSkill: jest.fn(),
      removeSkill: jest.fn(),
    };

    const updateData: UpdateJobData = {
      title: 'New Title',
      description: 'New Description',
      location: 'New Location',
      salaryMin: 5000,
      salaryMax: 8000,
      statusId: '2',
      typeId: '3',
      skills: ['React', 'Node.js'],
    };

    const updatedJob: JobEntity = {
      ...job,
      ...updateData,
      updateInfo: jest.fn(),
      addSkill: jest.fn(),
      removeSkill: jest.fn(),
    };

    jobRepository.get.mockResolvedValue(job);
    companyRepository.get.mockResolvedValue(company);
    jobRepository.update.mockResolvedValue(updatedJob);

    const result = await updateJobUseCase.execute(
      'job-1',
      'user-1',
      updateData,
    );

    expect(result).toEqual(updatedJob);
    expect(jobRepository.get.mock.calls[0][0]).toBe('job-1');
    expect(companyRepository.get.mock.calls[0][0]).toBe('company-1');
    expect(jobRepository.update.mock.calls[0][0]).toBe('job-1');
    expect(jobRepository.update.mock.calls[0][1]).toEqual(updateData);
  });

  it('throws NotFoundException if job does not exist', async () => {
    jobRepository.get.mockResolvedValue(null);

    const updateData: UpdateJobData = {
      title: 'New Title',
    };

    await expect(
      updateJobUseCase.execute('job-1', 'user-1', updateData),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws NotFoundException if company does not exist', async () => {
    const job: JobEntity = {
      id: 'job-1',
      title: 'Old Title',
      description: 'Old description',
      companyId: 'company-1',
      location: 'Remote',
      salaryMin: 4000,
      salaryMax: 7000,
      statusId: '1',
      typeId: '2',
      skills: ['React'],
      createdAt: new Date(),
      updatedAt: new Date(),
      updateInfo: jest.fn(),
      addSkill: jest.fn(),
      removeSkill: jest.fn(),
    };

    jobRepository.get.mockResolvedValue(job);
    companyRepository.get.mockResolvedValue(null);

    const updateData: UpdateJobData = {
      title: 'New Title',
    };

    await expect(
      updateJobUseCase.execute('job-1', 'user-1', updateData),
    ).rejects.toThrow(NotFoundException);
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

    const job: JobEntity = {
      id: 'job-1',
      title: 'Old Title',
      description: 'Old description',
      companyId: 'company-1',
      location: 'Remote',
      salaryMin: 4000,
      salaryMax: 7000,
      statusId: '1',
      typeId: '2',
      skills: ['React'],
      createdAt: new Date(),
      updatedAt: new Date(),
      updateInfo: jest.fn(),
      addSkill: jest.fn(),
      removeSkill: jest.fn(),
    };

    jobRepository.get.mockResolvedValue(job);
    companyRepository.get.mockResolvedValue(company);

    const updateData: UpdateJobData = {
      title: 'New Title',
    };

    await expect(
      updateJobUseCase.execute('job-1', 'user-999', updateData),
    ).rejects.toThrow(ForbiddenException);
  });
});
