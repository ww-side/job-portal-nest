import { CompanyRepository } from '~/core/company/company.repository';
import { NotFoundException } from '~/core/errors/not-found';

import { mockCompanyEntity } from '~/test/mocks/entities';
import { mockCompanyRepository } from '~/test/mocks/repositories';

import { GetCompanyUseCase } from './get-company.case';

describe('GetCompanyUseCase', () => {
  let companyRepository: jest.Mocked<CompanyRepository>;
  let getCompanyUseCase: GetCompanyUseCase;

  beforeEach(() => {
    companyRepository = mockCompanyRepository;

    getCompanyUseCase = new GetCompanyUseCase(companyRepository);
  });

  it('returns company if it exists', async () => {
    companyRepository.get.mockResolvedValue(mockCompanyEntity);

    const result = await getCompanyUseCase.execute('company-1');

    expect(result).toEqual(mockCompanyEntity);
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
