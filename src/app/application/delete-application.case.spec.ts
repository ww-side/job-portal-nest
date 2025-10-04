import { ApplicationEntity } from '~/core/application/application.entity';
import { ApplicationRepository } from '~/core/application/application.repository';
import { ForbiddenException } from '~/core/errors/forbidden';
import { NotFoundException } from '~/core/errors/not-found';

import { mockApplicationRepository } from '~/test/mocks/repositories';

import { DeleteApplicationUseCase } from './delete-application.case';

describe('DeleteApplicationUseCase', () => {
  let useCase: DeleteApplicationUseCase;
  let applicationRepository: jest.Mocked<ApplicationRepository>;

  beforeEach(() => {
    applicationRepository = mockApplicationRepository;
    useCase = new DeleteApplicationUseCase(applicationRepository);
  });

  it('deletes the application if the user is the owner', async () => {
    const application = new ApplicationEntity({
      id: 'app-123',
      userId: 'user-123',
      jobId: 'job-123',
      message: 'Test message',
      cvUrl: 'https://example.com/cv.pdf',
      statusId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    applicationRepository.get.mockResolvedValue(application);
    applicationRepository.delete.mockResolvedValue(application);

    const result = await useCase.execute('app-123', 'user-123');

    expect(applicationRepository.get.mock.calls[0][0]).toBe('app-123');
    expect(applicationRepository.delete.mock.calls[0][0]).toBe('app-123');
    expect(result).toBe(application);
  });

  it('throws NotFoundException if application does not exist', async () => {
    applicationRepository.get.mockResolvedValue(null);

    await expect(useCase.execute('app-123', 'user-123')).rejects.toThrow(
      NotFoundException,
    );
    expect(applicationRepository.delete.mock.calls).toHaveLength(0);
  });

  it('throws ForbiddenException if user is not the owner', async () => {
    const application = new ApplicationEntity({
      id: 'app-123',
      userId: 'owner-123',
      jobId: 'job-123',
      message: 'Test message',
      cvUrl: 'https://example.com/cv.pdf',
      statusId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    applicationRepository.get.mockResolvedValue(application);

    await expect(useCase.execute('app-123', 'user-456')).rejects.toThrow(
      ForbiddenException,
    );
    expect(applicationRepository.delete.mock.calls).toHaveLength(0);
  });
});
