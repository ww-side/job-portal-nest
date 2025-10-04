import { ForbiddenException } from '@nestjs/common';

import { ApplicationEntity } from '~/core/application/application.entity';
import { UserEntity } from '~/core/user/user.entity';

import {
  mockApplicationRepository,
  mockCompanyRepository,
  mockJobRepository,
  mockUserRepository,
} from '~/test/mocks/repositories';

import { GetAllApplicationsUseCase } from './get-all-applications.case';

describe('GetAllApplicationsUseCase', () => {
  let useCase: GetAllApplicationsUseCase;

  beforeEach(() => {
    useCase = new GetAllApplicationsUseCase(
      mockApplicationRepository,
      mockJobRepository,
      mockCompanyRepository,
      mockUserRepository,
    );

    jest.clearAllMocks();
  });

  it('throws ForbiddenException if user is not an employer', async () => {
    mockUserRepository.get.mockResolvedValue(
      new UserEntity({
        id: 'user-123',
        roleId: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isBanned: false,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    await expect(
      useCase.execute({ currentUserId: 'user-123' }),
    ).rejects.toThrow(ForbiddenException);

    expect(mockApplicationRepository.getAll.mock.calls).toHaveLength(0);
  });

  it('throws ForbiddenException if job does not belong to user company', async () => {
    mockUserRepository.get.mockResolvedValue(
      new UserEntity({
        id: 'user-123',
        roleId: 2,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isBanned: false,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
    mockJobRepository.get.mockResolvedValue({
      id: 'job-123',
      companyId: 'company-456',
      title: 'Job',
      description: 'Desc',
      location: 'Remote',
      statusId: '1',
      typeId: '2',
      skills: ['React', 'Node.js'],
      updateInfo: jest.fn(),
      addSkill: jest.fn(),
      removeSkill: jest.fn(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockCompanyRepository.get.mockResolvedValue({
      id: 'company-456',
      ownerId: 'other-user',
      name: 'Company',
      recruiterIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      addRecruiter: jest.fn(),
      removeRecruiter: jest.fn(),
      updateInfo: jest.fn(),
    });

    await expect(
      useCase.execute({ currentUserId: 'user-123', jobId: 'job-123' }),
    ).rejects.toThrow(ForbiddenException);

    expect(mockApplicationRepository.getAll.mock.calls).toHaveLength(0);
  });

  it('returns applications if user is employer and owns the company for the job', async () => {
    const applications = [
      new ApplicationEntity({
        id: 'app-1',
        userId: 'user-1',
        jobId: 'job-123',
        message: 'Message',
        cvUrl: 'cv.pdf',
        statusId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    mockUserRepository.get.mockResolvedValue(
      new UserEntity({
        id: 'user-123',
        roleId: 2,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isBanned: false,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
    mockJobRepository.get.mockResolvedValue({
      id: 'job-123',
      companyId: 'company-123',
      title: 'Job',
      description: 'Desc',
      location: 'Remote',
      statusId: '1',
      typeId: '2',
      skills: ['React', 'Node.js'],
      updateInfo: jest.fn(),
      addSkill: jest.fn(),
      removeSkill: jest.fn(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    mockCompanyRepository.get.mockResolvedValue({
      id: 'company-123',
      ownerId: 'user-123',
      name: 'Company',
      recruiterIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      addRecruiter: jest.fn(),
      removeRecruiter: jest.fn(),
      updateInfo: jest.fn(),
    });
    mockApplicationRepository.getAll.mockResolvedValue({
      data: applications,
      totalItems: 1,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10,
    });

    const result = await useCase.execute({
      currentUserId: 'user-123',
      jobId: 'job-123',
    });

    expect(result.data).toEqual(applications);
    expect(mockApplicationRepository.getAll.mock.calls).toHaveLength(1);
  });

  it('returns all applications if no jobId is provided', async () => {
    const applications = [
      new ApplicationEntity({
        id: 'app-1',
        userId: 'user-1',
        jobId: 'job-123',
        message: 'Message',
        cvUrl: 'cv.pdf',
        statusId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    ];

    mockUserRepository.get.mockResolvedValue(
      new UserEntity({
        id: 'user-123',
        roleId: 2,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        isBanned: false,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
    mockApplicationRepository.getAll.mockResolvedValue({
      data: applications,
      totalItems: 1,
      totalPages: 1,
      currentPage: 1,
      pageSize: 10,
    });

    const result = await useCase.execute({ currentUserId: 'user-123' });

    expect(result.data).toEqual(applications);
    expect(mockApplicationRepository.getAll.mock.calls).toHaveLength(1);
  });
});
