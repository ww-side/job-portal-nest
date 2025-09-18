import { CompanyEntity } from '~/core/company/company.entity';
import type { CompanyRepository } from '~/core/company/company.repository';
import { ForbiddenException } from '~/core/errors/forbidden';
import { NotFoundException } from '~/core/errors/not-found';

import { RemoveRecruiterUseCase } from './remove-recruiter.case';

describe('RemoveRecruiterUseCase', () => {
  let useCase: RemoveRecruiterUseCase;
  let companyRepository: jest.Mocked<CompanyRepository>;

  beforeEach(() => {
    companyRepository = {
      findById: jest.fn(),
      addRecruiter: jest.fn(),
      removeRecruiter: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findByOwnerId: jest.fn(),
    };

    useCase = new RemoveRecruiterUseCase(companyRepository);
  });

  it('removes a recruiter if requester is owner', async () => {
    const companyId = 'company-123';
    const userId = 'user-456';
    const requesterId = 'owner-123';

    const existingCompany = new CompanyEntity({
      id: companyId,
      name: 'Test Company',
      ownerId: requesterId,
      recruiterIds: [userId],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    companyRepository.findById.mockResolvedValue(existingCompany);
    companyRepository.removeRecruiter.mockImplementation(async () => {
      return await Promise.resolve(
        new CompanyEntity({
          ...existingCompany,
          recruiterIds: existingCompany.recruiterIds.filter(
            (id) => id !== userId,
          ),
        }),
      );
    });

    const result = await useCase.execute(companyId, userId, requesterId);

    expect(companyRepository.findById.mock.calls[0][0]).toBe(companyId);
    expect(companyRepository.removeRecruiter.mock.calls[0][0]).toBe(companyId);
    expect(result.recruiterIds).not.toContain(userId);
  });

  it('throws NotFoundException if company does not exist', async () => {
    companyRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute('company-123', 'user-456', 'owner-123'),
    ).rejects.toThrow(NotFoundException);

    expect(companyRepository.removeRecruiter.mock.calls).toHaveLength(0);
  });

  it('throws ForbiddenException if requester is not owner', async () => {
    const companyId = 'company-123';
    const existingCompany = new CompanyEntity({
      id: companyId,
      name: 'Test Company',
      ownerId: 'owner-123',
      recruiterIds: ['user-456'],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    companyRepository.findById.mockResolvedValue(existingCompany);

    await expect(
      useCase.execute(companyId, 'user-456', 'other-user-999'),
    ).rejects.toThrow(ForbiddenException);

    expect(companyRepository.removeRecruiter.mock.calls).toHaveLength(0);
  });
});
