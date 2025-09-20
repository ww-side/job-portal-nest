import {
  CompanyRepository,
  GetCompaniesFilters,
} from '~/core/company/company.repository';

export class GetCompaniesUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(options?: GetCompaniesFilters) {
    return await this.companyRepository.getAll(options);
  }
}
