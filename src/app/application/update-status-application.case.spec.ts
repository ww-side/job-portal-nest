import { ForbiddenException, NotFoundException } from '@nestjs/common';

import { ApplicationEntity } from '~/core/application/application.entity';

import { mockJobEntity } from '~/tests/mocks/entities';
import {
  mockApplicationRepository,
  mockCompanyRepository,
  mockJobRepository,
} from '~/tests/mocks/repositories';

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

  const mockApplication = {
    id: 'app-1',
    userId: 'user-123',
    jobId: 'job-1',
    message: 'Hello',
    cvUrl: 'cv.pdf',
    statusId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

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
    mockApplicationRepository.get.mockResolvedValue(mockApplication);
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
    mockApplicationRepository.get.mockResolvedValue(mockApplication);
    mockJobRepository.get.mockResolvedValue(mockJobEntity);
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
    mockApplicationRepository.get.mockResolvedValue(mockApplication);
    mockJobRepository.get.mockResolvedValue(mockJobEntity);
    mockCompanyRepository.get.mockResolvedValue({
      id: 'company-1',
      ownerId: 'owner-999',
      name: 'Company',
      recruiterIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
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
    mockJobRepository.get.mockResolvedValue(mockJobEntity);
    mockCompanyRepository.get.mockResolvedValue({
      id: 'company-1',
      ownerId: 'owner-123',
      name: 'Company',
      recruiterIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
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
