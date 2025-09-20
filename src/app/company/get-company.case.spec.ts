import { CompanyEntity } from '~/core/company/company.entity';
import { CompanyRepository } from '~/core/company/company.repository';
import { NotFoundException } from '~/core/errors/not-found';

import { GetCompanyUseCase } from './get-company.case';

describe('GetCompanyUseCase', () => {
  let companyRepository: jest.Mocked<CompanyRepository>;
  let getCompanyUseCase: GetCompanyUseCase;

  beforeEach(() => {
    companyRepository = {
      get: jest.fn(),
      getAll: jest.fn(),
      getByOwnerId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addRecruiter: jest.fn(),
      removeRecruiter: jest.fn(),
    };

    getCompanyUseCase = new GetCompanyUseCase(companyRepository);
  });

  it('returns company if it exists', async () => {
    const company: CompanyEntity = new CompanyEntity({
      id: 'company-1',
      name: 'Acme Corp',
      description: 'Test company',
      website: 'https://acme.com',
      logoUrl: 'https://acme.com/logo.png',
      ownerId: 'owner-1',
      recruiterIds: ['user-1', 'user-2'],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    companyRepository.get.mockResolvedValue(company);

    const result = await getCompanyUseCase.execute('company-1');

    expect(result).toEqual(company);
    expect(companyRepository.get.mock.calls[0][0]).toBe('company-1');
  });

  it('throws NotFoundException if company does not exist', async () => {
    companyRepository.get.mockResolvedValue(null);

    await expect(
      getCompanyUseCase.execute('non-existent-company'),
    ).rejects.toThrow(NotFoundException);

    expect(companyRepository.get.mock.calls[0][0]).toBe('non-existent-company');
  });
});
