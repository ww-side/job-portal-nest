import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { ApplicationEntity } from '~/core/application/application.entity';

import {
  mockApplicationRepository,
  mockCompanyRepository,
  mockJobRepository,
} from '~/test/mocks/repositories';

import { UpdateApplicationUseCase } from './update-application.case';

describe('UpdateApplicationUseCase', () => {
  let useCase: UpdateApplicationUseCase;

  beforeEach(() => {
    useCase = new UpdateApplicationUseCase(
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
        id: 'app-1',
        data: { message: 'Updated message' },
        currentUserId: 'user-123',
        jobId: 'job-1',
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
        id: 'app-1',
        data: { message: 'Updated message' },
        currentUserId: 'user-123',
        jobId: 'job-1',
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
        id: 'app-1',
        data: { message: 'Updated message' },
        currentUserId: 'user-123',
        jobId: 'job-1',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws ForbiddenException if user is not the owner of the application', async () => {
    mockApplicationRepository.get.mockResolvedValue(
      new ApplicationEntity({
        id: 'app-1',
        userId: 'owner-123',
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
      name: 'Company',
      ownerId: 'owner-123',
      recruiterIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      addRecruiter: jest.fn(),
      removeRecruiter: jest.fn(),
      updateInfo: jest.fn(),
    });

    await expect(
      useCase.execute({
        id: 'app-1',
        data: { message: 'Updated message' },
        currentUserId: 'user-123', // not the owner
        jobId: 'job-1',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('throws ForbiddenException if owner tries to update statusId', async () => {
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
      name: 'Company',
      ownerId: 'owner-123',
      recruiterIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      addRecruiter: jest.fn(),
      removeRecruiter: jest.fn(),
      updateInfo: jest.fn(),
    });

    await expect(
      useCase.execute({
        id: 'app-1',
        data: { statusId: '2' },
        currentUserId: 'user-123',
        jobId: 'job-1',
      }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('successfully updates application for owner with allowed fields', async () => {
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
      name: 'Company',
      ownerId: 'owner-123',
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
      id: 'app-1',
      data: { message: 'Updated message' },
      currentUserId: 'user-123',
      jobId: 'job-1',
    });

    expect(updated.message).toBe('Updated message');
  });
});
