import { CompanyEntity } from '~/core/company/company.entity';
import type { CompanyRepository } from '~/core/company/company.repository';
import { ForbiddenException } from '~/core/errors/forbidden';
import { NotFoundException } from '~/core/errors/not-found';

import { AddRecruiterUseCase } from './add-recruiter.case';

describe('AddRecruiterUseCase', () => {
  let useCase: AddRecruiterUseCase;
  let companyRepository: jest.Mocked<CompanyRepository>;

  beforeEach(() => {
    companyRepository = {
      get: jest.fn(),
      addRecruiter: jest.fn(),
      removeRecruiter: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getByOwnerId: jest.fn(),
      getAll: jest.fn(),
    };

    useCase = new AddRecruiterUseCase(companyRepository);
  });

  it('adds a recruiter if requester is owner', async () => {
    const companyId = 'company-123';
    const userId = 'user-456';
    const requesterId = 'owner-123';

    const existingCompany = new CompanyEntity({
      id: companyId,
      name: 'Test Company',
      ownerId: requesterId,
      recruiterIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    companyRepository.get.mockResolvedValue(existingCompany);
    companyRepository.addRecruiter.mockImplementation(async () => {
      return await Promise.resolve(
        new CompanyEntity({
          ...existingCompany,
          recruiterIds: [...existingCompany.recruiterIds, userId],
        }),
      );
    });

    const result = await useCase.execute(companyId, userId, requesterId);

    expect(companyRepository.get.mock.calls[0][0]).toBe(companyId);
    expect(companyRepository.addRecruiter.mock.calls[0][0]).toBe(companyId);
    expect(result.recruiterIds).toContain(userId);
  });

  it('throws NotFoundException if company does not exist', async () => {
    companyRepository.get.mockResolvedValue(null);

    await expect(
      useCase.execute('company-123', 'user-456', 'owner-123'),
    ).rejects.toThrow(NotFoundException);

    expect(companyRepository.addRecruiter.mock.calls).toHaveLength(0);
  });

  it('throws ForbiddenException if requester is not owner', async () => {
    const companyId = 'company-123';
    const existingCompany = new CompanyEntity({
      id: companyId,
      name: 'Test Company',
      ownerId: 'owner-123',
      recruiterIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    companyRepository.get.mockResolvedValue(existingCompany);

    await expect(
      useCase.execute(companyId, 'user-456', 'other-user-999'),
    ).rejects.toThrow(ForbiddenException);

    expect(companyRepository.addRecruiter.mock.calls).toHaveLength(0);
  });
});
