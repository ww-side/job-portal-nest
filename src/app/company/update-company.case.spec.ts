import { CompanyEntity } from '~/core/company/company.entity';
import type {
  CompanyRepository,
  UpdateCompanyData,
} from '~/core/company/company.repository';
import { NotFoundException } from '~/core/errors/not-found';

import { UpdateCompanyUseCase } from './update-company.case';

describe('UpdateCompanyUseCase', () => {
  let useCase: UpdateCompanyUseCase;
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

    useCase = new UpdateCompanyUseCase(companyRepository);
  });

  it('updates company fields', async () => {
    const companyId = 'company-123';
    const existingCompany = new CompanyEntity({
      id: companyId,
      name: 'Old Name',
      ownerId: 'owner-123',
      recruiterIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const updateData: UpdateCompanyData = {
      name: 'New Name',
      description: 'Updated description',
      ownerId: 'owner-123',
    };

    companyRepository.get.mockResolvedValue(existingCompany);
    companyRepository.update.mockImplementation(async (_, data) => {
      return await Promise.resolve(
        new CompanyEntity({
          ...existingCompany,
          ...data,
          updatedAt: new Date(),
        }),
      );
    });

    const updatedCompany = await useCase.execute(companyId, updateData);

    expect(companyRepository.get.mock.calls[0][0]).toBe(companyId);
    expect(companyRepository.update.mock.calls[0][0]).toBe(companyId);
    expect(updatedCompany.name).toBe('New Name');
    expect(updatedCompany.description).toBe('Updated description');
  });

  it('throws NotFoundException if company does not exist', async () => {
    const companyId = 'company-123';
    companyRepository.get.mockResolvedValue(null);

    await expect(
      useCase.execute(companyId, { name: 'New Name', ownerId: 'owner-123' }),
    ).rejects.toThrow(NotFoundException);

    expect(companyRepository.update.mock.calls).toHaveLength(0);
  });
});
