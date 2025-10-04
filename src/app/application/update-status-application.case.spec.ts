import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { ApplicationEntity } from '~/core/application/application.entity';

import {
  mockApplicationRepository,
  mockCompanyRepository,
  mockJobRepository,
} from '~/test/mocks/repositories';

import { UpdateApplicationStatusUseCase } from './update-status-application.case';

describe('UpdateApplicationStatusUseCase', () => {
  let useCase: UpdateApplicationStatusUseCase;

  beforeEach(() => {
    useCase = new UpdateApplicationStatusUseCase(
      mockApplicationRepository,
      mockJobRepository,
      mockCompanyRepository,
    );

    jest.clearAllMocks();
  });

  it('throws NotFoundException if application does not exist', async () => {
    mockApplicationRepository.get.mockResolvedValue(null);

    await expect(
      useCase.execute({
        applicationId: 'app-1',
        newStatusId: '2',
        currentUserId: 'owner-123',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws NotFoundException if job does not exist', async () => {
    mockApplicationRepository.get.mockResolvedValue(
      new ApplicationEntity({
        id: 'app-1',
        userId: 'user-123',
        jobId: 'job-1',
        message: 'Hello',
        cvUrl: 'cv.pdf',
        statusId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
    mockJobRepository.get.mockResolvedValue(null);

    await expect(
      useCase.execute({
        applicationId: 'app-1',
        newStatusId: '2',
        currentUserId: 'owner-123',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws NotFoundException if company does not exist', async () => {
    mockApplicationRepository.get.mockResolvedValue(
      new ApplicationEntity({
        id: 'app-1',
        userId: 'user-123',
        jobId: 'job-1',
        message: 'Hello',
        cvUrl: 'cv.pdf',
        statusId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
    mockJobRepository.get.mockResolvedValue({
      id: 'job-1',
      companyId: 'company-1',
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
    mockCompanyRepository.get.mockResolvedValue(null);

    await expect(
      useCase.execute({
        applicationId: 'app-1',
        newStatusId: '2',
        currentUserId: 'owner-123',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws ForbiddenException if current user is not company owner', async () => {
    mockApplicationRepository.get.mockResolvedValue(
      new ApplicationEntity({
        id: 'app-1',
        userId: 'user-123',
        jobId: 'job-1',
        message: 'Hello',
        cvUrl: 'cv.pdf',
        statusId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );
    mockJobRepository.get.mockResolvedValue({
      id: 'job-1',
      companyId: 'company-1',
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
      id: 'company-1',
      ownerId: 'owner-999',
      name: 'Company',
      recruiterIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      addRecruiter: jest.fn(),
      removeRecruiter: jest.fn(),
      updateInfo: jest.fn(),
    });

    await expect(
      useCase.execute({
        applicationId: 'app-1',
        newStatusId: '2',
        currentUserId: 'owner-123',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('successfully updates application status if user is company owner', async () => {
    const application = new ApplicationEntity({
      id: 'app-1',
      userId: 'user-123',
      jobId: 'job-1',
      message: 'Hello',
      cvUrl: 'cv.pdf',
      statusId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockApplicationRepository.get.mockResolvedValue(application);
    mockJobRepository.get.mockResolvedValue({
      id: 'job-1',
      companyId: 'company-1',
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
      id: 'company-1',
      ownerId: 'owner-123',
      name: 'Company',
      recruiterIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      addRecruiter: jest.fn(),
      removeRecruiter: jest.fn(),
      updateInfo: jest.fn(),
    });

    mockApplicationRepository.update.mockImplementation(async (id, data) =>
      Promise.resolve(
        new ApplicationEntity({
          ...application,
          ...data,
          updatedAt: new Date(),
        }),
      ),
    );

    const updated = await useCase.execute({
      applicationId: 'app-1',
      newStatusId: '2',
      currentUserId: 'owner-123',
    });

    expect(updated.statusId).toBe('2');
    expect(mockApplicationRepository.update.mock.calls[0][0]).toBe('app-1');
    expect(mockApplicationRepository.update.mock.calls[0][1]).toEqual({
      statusId: '2',
    });
  });
});
