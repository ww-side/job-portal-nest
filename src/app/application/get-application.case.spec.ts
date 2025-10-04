import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { ApplicationEntity } from '~/core/application/application.entity';
import { UserEntity } from '~/core/user/user.entity';

import {
  mockApplicationRepository,
  mockCompanyRepository,
  mockJobRepository,
  mockUserRepository,
} from '~/test/mocks/repositories';

import { GetApplicationUseCase } from './get-application.case';

describe('GetApplicationUseCase', () => {
  let useCase: GetApplicationUseCase;

  beforeEach(() => {
    useCase = new GetApplicationUseCase(
      mockApplicationRepository,
      mockJobRepository,
      mockCompanyRepository,
      mockUserRepository,
    );

    jest.clearAllMocks();
  });

  it('throws NotFoundException if application does not exist', async () => {
    mockApplicationRepository.get.mockResolvedValue(null);
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

    await expect(
      useCase.execute({ id: 'app-1', currentUserId: 'user-123' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws ForbiddenException if user is not an employer', async () => {
    mockApplicationRepository.get.mockResolvedValue(
      new ApplicationEntity({
        id: 'app-1',
        userId: 'user-1',
        jobId: 'job-1',
        message: 'Hello',
        cvUrl: 'cv.pdf',
        statusId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

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
      useCase.execute({ id: 'app-1', currentUserId: 'user-123' }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('throws NotFoundException if job does not exist', async () => {
    mockApplicationRepository.get.mockResolvedValue(
      new ApplicationEntity({
        id: 'app-1',
        userId: 'user-1',
        jobId: 'job-1',
        message: 'Hello',
        cvUrl: 'cv.pdf',
        statusId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

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
    mockJobRepository.get.mockResolvedValue(null);

    await expect(
      useCase.execute({ id: 'app-1', currentUserId: 'user-123' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws ForbiddenException if job does not belong to user company', async () => {
    mockApplicationRepository.get.mockResolvedValue(
      new ApplicationEntity({
        id: 'app-1',
        userId: 'user-1',
        jobId: 'job-1',
        message: 'Hello',
        cvUrl: 'cv.pdf',
        statusId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

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
      id: 'job-1',
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
      useCase.execute({ id: 'app-1', currentUserId: 'user-123' }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('returns the application if user is employer and owns the company', async () => {
    const application = new ApplicationEntity({
      id: 'app-1',
      userId: 'user-1',
      jobId: 'job-1',
      message: 'Hello',
      cvUrl: 'cv.pdf',
      statusId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockApplicationRepository.get.mockResolvedValue(application);
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
      id: 'job-1',
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

    const result = await useCase.execute({
      id: 'app-1',
      currentUserId: 'user-123',
    });

    expect(result).toEqual(application);
  });
});
