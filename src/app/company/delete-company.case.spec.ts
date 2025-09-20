import { CompanyEntity } from '~/core/company/company.entity';
import type { CompanyRepository } from '~/core/company/company.repository';
import { NotFoundException } from '~/core/errors/not-found';

import { DeleteCompanyUseCase } from './delete-company.case';

describe('DeleteCompanyUseCase', () => {
  let useCase: DeleteCompanyUseCase;
  let companyRepository: jest.Mocked<CompanyRepository>;

  beforeEach(() => {
    companyRepository = {
      get: jest.fn(),
      getByOwnerId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addRecruiter: jest.fn(),
      removeRecruiter: jest.fn(),
      getAll: jest.fn(),
    };

    useCase = new DeleteCompanyUseCase(companyRepository);
  });

  it('deletes company', async () => {
    const companyId = 'company-123';
    const ownerId = 'owner-123';
    const existingCompany = new CompanyEntity({
      id: companyId,
      name: 'Test Company',
      ownerId: 'owner-123',
      recruiterIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    companyRepository.get.mockResolvedValue(existingCompany);
    companyRepository.delete.mockResolvedValue(existingCompany);

    const deletedCompany = await useCase.execute(companyId, ownerId);

    expect(companyRepository.get.mock.calls[0][0]).toBe(companyId);
    expect(companyRepository.delete.mock.calls[0][0]).toBe(companyId);
    expect(deletedCompany).toBeInstanceOf(CompanyEntity);
    expect(deletedCompany.id).toBe(companyId);
  });

  it('throws NotFoundException if company does not exist', async () => {
    const companyId = 'company-123';
    const ownerId = 'owner-123';
    companyRepository.get.mockResolvedValue(null);

    await expect(useCase.execute(companyId, ownerId)).rejects.toThrow(
      NotFoundException,
    );

    expect(companyRepository.delete.mock.calls).toHaveLength(0);
  });
});
