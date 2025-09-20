import { ForbiddenException } from '@nestjs/common';

import { CompanyEntity } from '~/core/company/company.entity';
import { CompanyRepository } from '~/core/company/company.repository';
import { NotFoundException } from '~/core/errors/not-found';
import { JobEntity } from '~/core/job/job.entity';
import { JobRepository } from '~/core/job/job.repository';

import { DeleteJobUseCase } from './delete-job.case';

describe('DeleteJobUseCase', () => {
  let jobRepository: jest.Mocked<JobRepository>;
  let companyRepository: jest.Mocked<CompanyRepository>;
  let deleteJobUseCase: DeleteJobUseCase;

  beforeEach(() => {
    jobRepository = {
      get: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      getAll: jest.fn(),
      update: jest.fn(),
      addSkill: jest.fn(),
      removeSkill: jest.fn(),
    };

    companyRepository = {
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getByOwnerId: jest.fn(),
      addRecruiter: jest.fn(),
      removeRecruiter: jest.fn(),
      getAll: jest.fn(),
    };

    deleteJobUseCase = new DeleteJobUseCase({
      jobRepository,
      companyRepository,
    });
  });

  it('deletes a job successfully if user is owner', async () => {
    // Arrange
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

    jobRepository.get.mockResolvedValue(job);
    companyRepository.get.mockResolvedValue(company);
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
    // Arrange
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

    jobRepository.get.mockResolvedValue(job);
    companyRepository.get.mockResolvedValue(null);

    await expect(deleteJobUseCase.execute('job-1', 'user-1')).rejects.toThrow(
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

    jobRepository.get.mockResolvedValue(job);
    companyRepository.get.mockResolvedValue(company);

    // Act & Assert
    await expect(deleteJobUseCase.execute('job-1', 'user-999')).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('allows a recruiter to delete a job', async () => {
    const company: CompanyEntity = {
      id: 'company-1',
      name: 'Acme Corp',
      ownerId: 'owner-1',
      recruiterIds: ['user-2'],
      createdAt: new Date(),
      updatedAt: new Date(),
      addRecruiter: jest.fn(),
      removeRecruiter: jest.fn(),
      updateInfo: jest.fn(),
    };

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

    jobRepository.get.mockResolvedValue(job);
    companyRepository.get.mockResolvedValue(company);
    jobRepository.delete.mockResolvedValue(job);

    const result = await deleteJobUseCase.execute('job-1', 'user-2');

    expect(result).toEqual(job);
    expect(jobRepository.delete.mock.calls[0][0]).toBe('job-1');
  });
});
