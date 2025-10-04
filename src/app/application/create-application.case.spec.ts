import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { ApplicationEntity } from '~/core/application/application.entity';
import {
  ApplicationRepository,
  CreateApplicationData,
} from '~/core/application/application.repository';
import { JobRepository } from '~/core/job/job.repository';
import { UserEntity } from '~/core/user/user.entity';
import { UserRepository } from '~/core/user/user.repository';

import {
  mockApplicationRepository,
  mockJobRepository,
  mockUserRepository,
} from '~/test/mocks/repositories';

import { CreateApplicationUseCase } from './create-application.case';

describe('CreateApplicationUseCase', () => {
  let useCase: CreateApplicationUseCase;
  let applicationRepository: jest.Mocked<ApplicationRepository>;
  let userRepository: jest.Mocked<UserRepository>;
  let jobRepository: jest.Mocked<JobRepository>;

  beforeEach(() => {
    applicationRepository = mockApplicationRepository;
    userRepository = mockUserRepository;
    jobRepository = mockJobRepository;

    useCase = new CreateApplicationUseCase(
      applicationRepository,
      userRepository,
      jobRepository,
    );
  });

  it('creates a new application if user and job exist and user has not applied yet', async () => {
    const data: CreateApplicationData = {
      userId: 'user-123',
      jobId: 'job-123',
      message: 'I am interested in this job',
      cvUrl: 'https://example.com/cv.pdf',
      statusId: '1',
    };

    userRepository.get.mockResolvedValue(
      new UserEntity({
        id: 'user-123',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        roleId: 1,
        isBanned: false,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    jobRepository.get.mockResolvedValue({
      id: 'job-123',
      companyId: 'company-123',
      title: 'Software Engineer',
      description: 'Job description',
      createdAt: new Date(),
      updatedAt: new Date(),
      location: 'Remote',
      salaryMin: 5000,
      salaryMax: 8000,
      statusId: '1',
      typeId: '2',
      skills: ['React', 'Node.js'],
      updateInfo: jest.fn(),
      addSkill: jest.fn(),
      removeSkill: jest.fn(),
    });

    applicationRepository.getAll.mockResolvedValue({
      data: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1,
      pageSize: 10,
    });

    applicationRepository.create.mockImplementation(async (input) => {
      return Promise.resolve(
        new ApplicationEntity({
          ...input,
          id: 'application-123',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );
    });

    const application = await useCase.execute(data);

    expect(userRepository.get.mock.calls[0][0]).toBe('user-123');
    expect(jobRepository.get.mock.calls[0][0]).toBe('job-123');
    expect(applicationRepository.getAll.mock.calls[0][0]).toEqual({
      userId: 'user-123',
      jobId: 'job-123',
    });
    expect(applicationRepository.create.mock.calls[0][0]).toEqual(data);
    expect(application).toBeInstanceOf(ApplicationEntity);
    expect(application.id).toBe('application-123');
  });

  it('throws NotFoundException if user does not exist', async () => {
    const data: CreateApplicationData = {
      userId: 'user-123',
      jobId: 'job-123',
      message: 'Message',
      statusId: '1',
    };

    userRepository.get.mockResolvedValue(null);

    await expect(useCase.execute(data)).rejects.toThrow(NotFoundException);
    expect(applicationRepository.create.mock.calls).toHaveLength(0);
  });

  it('throws NotFoundException if job does not exist', async () => {
    const data: CreateApplicationData = {
      userId: 'user-123',
      jobId: 'job-123',
      message: 'Message',
      statusId: '1',
    };

    userRepository.get.mockResolvedValue(
      new UserEntity({
        id: 'user-123',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        roleId: 1,
        isBanned: false,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    jobRepository.get.mockResolvedValue(null);

    await expect(useCase.execute(data)).rejects.toThrow(NotFoundException);
    expect(applicationRepository.create.mock.calls).toHaveLength(0);
  });

  it('throws ForbiddenException if user is banned', async () => {
    const data: CreateApplicationData = {
      userId: 'user-123',
      jobId: 'job-123',
      message: 'Message',
      statusId: '1',
    };

    userRepository.get.mockResolvedValue(
      new UserEntity({
        id: 'user-123',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        roleId: 1,
        isBanned: true,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    jobRepository.get.mockResolvedValue({
      id: 'job-123',
      companyId: 'company-123',
      title: 'Job',
      description: 'Desc',
      createdAt: new Date(),
      updatedAt: new Date(),
      location: 'Remote',
      salaryMin: 5000,
      salaryMax: 8000,
      statusId: '1',
      typeId: '2',
      skills: ['React', 'Node.js'],
      updateInfo: jest.fn(),
      addSkill: jest.fn(),
      removeSkill: jest.fn(),
    });

    await expect(useCase.execute(data)).rejects.toThrow(ForbiddenException);
    expect(applicationRepository.create.mock.calls).toHaveLength(0);
  });

  it('throws ForbiddenException if user already applied to this job', async () => {
    const data: CreateApplicationData = {
      userId: 'user-123',
      jobId: 'job-123',
      message: 'Message',
      statusId: '1',
    };

    userRepository.get.mockResolvedValue(
      new UserEntity({
        id: 'user-123',
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        roleId: 1,
        isBanned: false,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    jobRepository.get.mockResolvedValue({
      id: 'job-123',
      companyId: 'company-123',
      title: 'Job',
      description: 'Desc',
      createdAt: new Date(),
      updatedAt: new Date(),
      location: 'Remote',
      salaryMin: 5000,
      salaryMax: 8000,
      statusId: '1',
      typeId: '2',
      skills: ['React', 'Node.js'],
      updateInfo: jest.fn(),
      addSkill: jest.fn(),
      removeSkill: jest.fn(),
    });

    applicationRepository.getAll.mockResolvedValue({
      data: [
        new ApplicationEntity({
          id: 'application-1',
          userId: 'user-123',
          jobId: 'job-123',
          message: 'Already applied',
          statusId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ],
      totalItems: 1,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10,
    });

    await expect(useCase.execute(data)).rejects.toThrow(ForbiddenException);
    expect(applicationRepository.create.mock.calls).toHaveLength(0);
  });
});
