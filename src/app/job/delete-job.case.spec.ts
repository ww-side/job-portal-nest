import { ForbiddenException } from '@nestjs/common';

import { CompanyRepository } from '~/core/company/company.repository';
import { NotFoundException } from '~/core/errors/not-found';
import { JobEntity } from '~/core/job/job.entity';
import { JobRepository } from '~/core/job/job.repository';

import { mockCompanyEntity } from '~/test/mocks/entities';
import {
  mockCompanyRepository,
  mockJobRepository,
} from '~/test/mocks/repositories';

import { DeleteJobUseCase } from './delete-job.case';

describe('DeleteJobUseCase', () => {
  let jobRepository: jest.Mocked<JobRepository>;
  let companyRepository: jest.Mocked<CompanyRepository>;
  let deleteJobUseCase: DeleteJobUseCase;

  beforeEach(() => {
    jobRepository = mockJobRepository;
    companyRepository = mockCompanyRepository;

    deleteJobUseCase = new DeleteJobUseCase({
      jobRepository,
      companyRepository,
    });
  });

  const job: JobEntity = {
    id: 'job-1',
    title: 'Frontend Developer',
    description: 'Job description',
    companyId: 'company-1',
    location: 'Remote',
    salaryMin: 5000,
    salaryMax: 8000,
    statusId: '1',
    typeId: '2',
    skills: ['React', 'Node.js'],
    createdAt: new Date(),
    updatedAt: new Date(),
    updateInfo: jest.fn(),
    addSkill: jest.fn(),
    removeSkill: jest.fn(),
  };

  it('deletes a job successfully if user is owner', async () => {
    jobRepository.get.mockResolvedValue(job);
    companyRepository.get.mockResolvedValue(mockCompanyEntity);
    jobRepository.delete.mockResolvedValue(job);

    const result = await deleteJobUseCase.execute('job-1', 'user-1');

    expect(result).toEqual(job);
    expect(jobRepository.get.mock.calls[0][0]).toBe('job-1');
    expect(companyRepository.get.mock.calls[0][0]).toBe('company-1');
    expect(jobRepository.delete.mock.calls[0][0]).toBe('job-1');
  });

  it('throws NotFoundException if job does not exist', async () => {
    jobRepository.get.mockResolvedValue(null);

    await expect(deleteJobUseCase.execute('job-1', 'user-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws NotFoundException if company does not exist', async () => {
    jobRepository.get.mockResolvedValue(job);
    companyRepository.get.mockResolvedValue(null);

    await expect(deleteJobUseCase.execute('job-1', 'user-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws ForbiddenException if user is not owner or recruiter', async () => {
    jobRepository.get.mockResolvedValue(job);
    companyRepository.get.mockResolvedValue(mockCompanyEntity);

    await expect(deleteJobUseCase.execute('job-1', 'user-999')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('allows a recruiter to delete a job', async () => {
    jobRepository.get.mockResolvedValue(job);
    companyRepository.get.mockResolvedValue(mockCompanyEntity);
    jobRepository.delete.mockResolvedValue(job);

    const result = await deleteJobUseCase.execute('job-1', 'user-2');

    expect(result).toEqual(job);
    expect(jobRepository.delete.mock.calls[0][0]).toBe('job-1');
  });
});
